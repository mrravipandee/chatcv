import mongoose from 'mongoose';
import { User } from '../auth/models/user.model';
import { Resume, IResumeData, ISkillGroup, IContactLink } from '../resume/models/resume.model';
import { ChatMessage } from './models/chat-message.model';
import { buildConversationPrompt, buildExtractionPrompt } from './chat.prompt';
import {
  getCachedResume,
  setCachedResume,
  invalidateResumeCache,
  incrementChatTokens,
  getChatTokenCount,
} from '../../config/redis.client';

import dotenv from 'dotenv';
dotenv.config();

const EMPTY_RESUME: IResumeData = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  links: [],
  education: [],
  skills: [],
  experience: [],
  projects: [],
  achievements: [],
};

const MODEL = 'gpt-4o-mini';
const EURI_API_URL = 'https://api.euron.one/api/v1/euri/chat/completions';

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function isValidString(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim() !== '' &&
    value !== 'Your Name' &&
    value !== 'N/A' &&
    value !== 'string'
  );
}

function parseJson(raw: string): Record<string, any> {
  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  console.log('[CHAT] Extraction raw:', cleaned.slice(0, 300));

  try {
    return JSON.parse(cleaned);
  } catch {
    console.warn('[CHAT] Failed to parse extraction JSON — returning empty');
    return {};
  }
}

// ─────────────────────────────────────────
// Merge Helpers
// ─────────────────────────────────────────

function mergeSkills(
  oldSkills: ISkillGroup[],
  newSkills: ISkillGroup[],
  replace: boolean
): ISkillGroup[] {
  if (replace) return [...newSkills];
  if (!newSkills?.length) return oldSkills;

  const updated = [...oldSkills];

  for (const incoming of newSkills) {
    if (!incoming?.category) continue;

    const idx = updated.findIndex(
      (s) => s?.category?.toLowerCase() === incoming.category.toLowerCase()
    );

    if (idx >= 0) {
      updated[idx] = {
        ...updated[idx],
        items: [...new Set([...(updated[idx].items || []), ...(incoming.items || [])])],
      };
    } else {
      updated.push(incoming);
    }
  }

  return updated;
}

function mergeLinks(
  oldLinks: IContactLink[],
  newLinks: IContactLink[],
  replace: boolean
): IContactLink[] {
  if (replace) return [...newLinks];
  if (!newLinks?.length) return oldLinks;

  const updated = [...oldLinks];

  for (const incoming of newLinks) {
    if (!incoming?.label) continue;

    const idx = updated.findIndex(
      (l) => l?.label?.toLowerCase() === incoming.label.toLowerCase()
    );

    if (idx >= 0) {
      updated[idx] = { ...updated[idx], ...incoming };
    } else {
      updated.push(incoming);
    }
  }

  return updated;
}

function mergeByKey<T extends Record<string, any>>(
  oldArr: T[],
  newArr: T[],
  key: keyof T,
  replace: boolean
): T[] {
  if (replace) return [...newArr];
  if (!newArr?.length) return oldArr;

  const updated = [...oldArr];

  for (const item of newArr) {
    if (!item?.[key]) continue;

    const idx = updated.findIndex(
      (e) =>
        typeof e[key] === 'string' &&
        typeof item[key] === 'string' &&
        (e[key] as string).toLowerCase() === (item[key] as string).toLowerCase()
    );

    if (idx >= 0) {
      updated[idx] = { ...updated[idx], ...item };
    } else {
      updated.push(item);
    }
  }

  return updated;
}

function mergeExperience(
  oldArr: IResumeData['experience'],
  newArr: IResumeData['experience'],
  replace: boolean
): IResumeData['experience'] {
  if (replace) return [...newArr];
  if (!newArr?.length) return oldArr;

  const updated = [...oldArr];

  for (const item of newArr) {
    if (!item?.company || !item?.role) continue;

    const idx = updated.findIndex(
      (e) =>
        e?.company?.toLowerCase() === item.company.toLowerCase() &&
        e?.role?.toLowerCase() === item.role.toLowerCase()
    );

    if (idx >= 0) {
      updated[idx] = { ...updated[idx], ...item };
    } else {
      updated.push(item);
    }
  }

  return updated;
}

// ─────────────────────────────────────────
// Main Merge
// ─────────────────────────────────────────

function mergeResumeData(
  old: IResumeData,
  incoming: Partial<IResumeData>,
  replace: boolean
): IResumeData {
  return {
    name: isValidString(incoming.name) ? incoming.name.trim() : old.name,
    role: isValidString(incoming.role) ? incoming.role.trim() : old.role,
    email: isValidString(incoming.email) ? incoming.email.trim() : old.email,
    phone: isValidString(incoming.phone) ? incoming.phone.trim() : old.phone,
    location: isValidString(incoming.location) ? incoming.location.trim() : old.location,
    summary: isValidString(incoming.summary) ? incoming.summary.trim() : old.summary,

    links: incoming.links ? mergeLinks(old.links, incoming.links, replace) : old.links,
    skills: incoming.skills ? mergeSkills(old.skills, incoming.skills, replace) : old.skills,
    experience: incoming.experience
      ? mergeExperience(old.experience, incoming.experience, replace)
      : old.experience,
    projects: incoming.projects
      ? mergeByKey(old.projects, incoming.projects, 'name', replace)
      : old.projects,
    education: incoming.education
      ? mergeByKey(old.education, incoming.education, 'institution', replace)
      : old.education,
    achievements: incoming.achievements
      ? mergeByKey(old.achievements, incoming.achievements, 'title', replace)
      : old.achievements,
  };
}

// ─────────────────────────────────────────
// API Call
// ─────────────────────────────────────────

async function callEuriAPI(
  messages: Array<{ role: string; content: string }>,
  label = 'call'
): Promise<string> {
  if (!process.env.EURI_API_KEY) throw new Error('EURI_API_KEY is not set');

  console.log(`[CHAT] EURI ${label} — sending ${messages.length} messages`);

  const response = await fetch(EURI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.EURI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1200,
    }),
  });

  // Always read body as text first so we can log it on error
  const rawBody = await response.text();

  if (!response.ok) {
    console.error(`[CHAT] EURI ${label} HTTP ${response.status}:`, rawBody.slice(0, 400));
    throw new Error(`EURI API error (${response.status}): ${rawBody.slice(0, 200)}`);
  }

  try {
    const data = JSON.parse(rawBody) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch {
    console.error(`[CHAT] EURI ${label} — invalid JSON response:`, rawBody.slice(0, 200));
    throw new Error('EURI API returned invalid JSON');
  }
}

// ─────────────────────────────────────────
// MAIN SERVICE
// ─────────────────────────────────────────

export const sendChatMessageService = async (
  userId: string,
  message: string,
  resumeId?: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // ── Token limit check ──────────────────────────────────────────────────────
  let tokensUsed = user.chatTokensUsed;
  const tokensLimit = user.chatTokensLimit;

  // Try Redis first for the count
  const redisCount = await getChatTokenCount(userId);
  if (redisCount !== null) {
    tokensUsed = redisCount;
  }

  if (tokensUsed >= tokensLimit) {
    throw new Error(`CHAT_LIMIT_REACHED:${tokensLimit}`);
  }

  // ── Load existing resume (try Redis cache first) ───────────────────────────
  let existingResume = null;

  if (resumeId) {
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new Error('Invalid resume id');
    }

    // Try cache
    const cached = await getCachedResume(resumeId);
    if (cached) {
      console.log('[CHAT] Resume loaded from Redis cache');
      // We still need the Mongoose doc for saving — load from DB
    }

    existingResume = await Resume.findOne({
      _id: resumeId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!existingResume) throw new Error('Resume not found');
  }

  const existingData = (existingResume?.data as IResumeData) ?? EMPTY_RESUME;

  // ── Load chat history (last 10 messages) ──────────────────────────────────
  let history: Array<{ role: string; message: string }> = [];

  if (existingResume) {
    history = await ChatMessage.find({ resumeId: existingResume._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('role message -_id')
      .lean();
    history.reverse(); // chronological order
  }

  // ── Run AI calls sequentially to avoid rate limits ───────────────────────────
  console.log('[CHAT] Calling AI — conversational reply...');

  const reply = await callEuriAPI(
    [
      {
        role: 'system',
        content: buildConversationPrompt(message, existingData, history),
      },
      { role: 'user', content: message },
    ],
    'reply'
  );

  console.log('[CHAT] Calling AI — data extraction...');

  const extractionRaw = await callEuriAPI(
    [
      {
        role: 'system',
        content: buildExtractionPrompt(message, existingData),
      },
      { role: 'user', content: message },
    ],
    'extract'
  );

  const extracted = parseJson(extractionRaw);
  const replaceArrays = extracted.replaceArrays === true;

  // ── Merge & save resume ────────────────────────────────────────────────────
  let resume;

  if (existingResume) {
    const merged = mergeResumeData(existingData, extracted, replaceArrays);
    existingResume.data = merged;

    if (merged.role && existingResume.title === 'My Resume') {
      existingResume.title = merged.name || merged.role;
    }

    (existingResume as any).markModified('data');
    await existingResume.save();

    // Invalidate cache after update
    await invalidateResumeCache(resumeId!);
    // Cache the new data
    await setCachedResume(resumeId!, merged);

    resume = existingResume;
  } else {
    const merged = mergeResumeData(EMPTY_RESUME, extracted, false);

    resume = await Resume.create({
      userId,
      title: merged.name || merged.role || 'My Resume',
      data: merged,
    });

    // Cache the new resume
    await setCachedResume(resume._id.toString(), merged);
  }

  // ── Save chat messages to DB ───────────────────────────────────────────────
  const resumeObjectId = new mongoose.Types.ObjectId(resume._id.toString());
  const userObjectId = new mongoose.Types.ObjectId(userId);

  await ChatMessage.insertMany([
    {
      userId: userObjectId,
      resumeId: resumeObjectId,
      role: 'user',
      message,
    },
    {
      userId: userObjectId,
      resumeId: resumeObjectId,
      role: 'assistant',
      message: reply,
    },
  ]);

  // ── Increment token counter ────────────────────────────────────────────────
  // Try Redis first (atomic), fallback to MongoDB
  const redisNew = await incrementChatTokens(userId);
  if (redisNew === null) {
    // Redis unavailable — update MongoDB directly
    await User.findByIdAndUpdate(userId, { $inc: { chatTokensUsed: 1 } });
  } else {
    // Periodically sync Redis → MongoDB (every 5 chats)
    if (redisNew % 5 === 0) {
      await User.findByIdAndUpdate(userId, { chatTokensUsed: redisNew });
    }
  }

  return {
    success: true,
    reply,
    resumeId: resume._id.toString(),
    resumeData: resume.data,
    tokensUsed: redisNew ?? tokensUsed + 1,
    tokensLimit,
  };
};

// ─────────────────────────────────────────
// Chat History Service
// ─────────────────────────────────────────

export const getChatHistoryService = async (userId: string, resumeId: string) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new Error('Invalid resume id');
  }

  // Verify resume belongs to user
  const resume = await Resume.findOne({
    _id: resumeId,
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();

  if (!resume) throw new Error('Resume not found or access denied');

  const messages = await ChatMessage.find({ resumeId })
    .sort({ createdAt: 1 })
    .select('role message createdAt -_id')
    .lean();

  return messages;
};
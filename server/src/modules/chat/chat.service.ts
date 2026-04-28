import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { User } from '../auth/models/user.model';
import { Resume, IResumeData, IExperience, IProject } from '../resume/models/resume.model';
import { ChatMessage } from './models/chat-message.model';
import { buildResumePrompt } from './chat.prompt';

interface AiResponse {
  reply: string;
  resumeData: Partial<IResumeData>;
  replaceArrays?: boolean;
}

const EMPTY_RESUME: IResumeData = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  links: [],
};

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '' && value !== 'Your Name' && value !== 'N/A';
}

function parseAiResponse(raw: string): AiResponse {
  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  console.log('AI raw response:', cleaned);
  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.reply !== 'string') {
      throw new Error('Missing reply string');
    }
    if (!parsed.resumeData || typeof parsed.resumeData !== 'object') {
      throw new Error('Missing resumeData object');
    }
    return {
      reply: parsed.reply,
      resumeData: parsed.resumeData,
      replaceArrays: parsed.replaceArrays === true,
    };
  } catch (err) {
    throw new Error(`Failed to parse AI response: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function mergeArrays<T>(oldArr: T[], newArr: T[], replace: boolean): T[] {
  if (replace) return [...newArr];
  // Append new items, avoid duplicates by simple string comparison for primitive or by title+company for experience
  if (newArr.length === 0) return oldArr;
  if (typeof newArr[0] === 'string') {
    return [...new Set([...oldArr as string[], ...newArr as string[]])] as T[];
  }
  // For objects (experience/projects), naive append (you can enhance duplicate detection)
  return [...oldArr, ...newArr];
}

function mergeResumeData(
  oldData: IResumeData,
  incoming: Partial<IResumeData>,
  replaceArrays: boolean
): IResumeData {
  return {
    name: isValidString(incoming.name) ? incoming.name.trim() : oldData.name,
    role: isValidString(incoming.role) ? incoming.role.trim() : oldData.role,
    email: isValidString(incoming.email) ? incoming.email.trim() : oldData.email,
    phone: isValidString(incoming.phone) ? incoming.phone.trim() : oldData.phone,
    location: isValidString(incoming.location) ? incoming.location.trim() : oldData.location,
    summary: isValidString(incoming.summary) ? incoming.summary.trim() : oldData.summary,
    skills: incoming.skills ? mergeArrays(oldData.skills, incoming.skills, replaceArrays) : oldData.skills,
    experience: incoming.experience
      ? mergeArrays(oldData.experience, incoming.experience, replaceArrays)
      : oldData.experience,
    projects: incoming.projects
      ? mergeArrays(oldData.projects, incoming.projects, replaceArrays)
      : oldData.projects,
    links: incoming.links ? mergeArrays(oldData.links, incoming.links, replaceArrays) : oldData.links,
  };
}

export const sendChatMessageService = async (
  userId: string,
  message: string,
  resumeId?: string
) => {
  if (!process.env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  let existingResume = null;
  if (resumeId) {
    if (!mongoose.Types.ObjectId.isValid(resumeId)) throw new Error('Invalid resume id');
    existingResume = await Resume.findOne({ _id: resumeId, userId: new mongoose.Types.ObjectId(userId) });
    if (!existingResume) throw new Error('Resume not found');
  }

  // Get last 10 messages for context
  let history: Array<{ role: string; message: string }> = [];
  if (existingResume) {
    history = await ChatMessage.find({ resumeId: existingResume._id })
      .sort({ createdAt: 1 })
      .limit(10)
      .select('role message -_id')
      .lean();
  }

  const prompt = buildResumePrompt(message, existingResume?.data || EMPTY_RESUME, history);
  const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  const rawText = result.text;
  if (!rawText) throw new Error('Empty AI response');

  const parsed = parseAiResponse(rawText);

  let resume;
  if (existingResume) {
    const oldData = (existingResume.data as IResumeData) || EMPTY_RESUME;
    const merged = mergeResumeData(oldData, parsed.resumeData, parsed.replaceArrays ?? false);
    existingResume.data = merged;
    if (merged.role && existingResume.title === 'My Resume') existingResume.title = merged.role;
    existingResume.markModified('data');
    await existingResume.save();
    resume = existingResume;
  } else {
    const merged = mergeResumeData(EMPTY_RESUME, parsed.resumeData, false);
    resume = await Resume.create({ userId, title: merged.role || 'My Resume', data: merged });
  }

  // Save chat messages
  await ChatMessage.create([
    { userId, resumeId: resume._id, role: 'user', message },
    { userId, resumeId: resume._id, role: 'assistant', message: parsed.reply },
  ]);

  return {
    success: true,
    reply: parsed.reply,
    resumeId: resume._id.toString(),
    resumeData: resume.data,
  };
};

export const getChatHistoryService = async (userId: string, resumeId: string) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) throw new Error('Invalid resume id');
  const resume = await Resume.findOne({ _id: resumeId, userId: new mongoose.Types.ObjectId(userId) });
  if (!resume) throw new Error('Resume not found');
  return await ChatMessage.find({ resumeId }).sort({ createdAt: 1 }).select('role message createdAt -_id').lean();
};
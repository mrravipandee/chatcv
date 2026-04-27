import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { User } from "../auth/models/user.model";
import { Resume } from "../resume/models/resume.model";
import { ChatMessage } from "./models/chat-message.model";

import { buildResumePrompt } from "./chat.prompt";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

// -----------------------------
// Clean Gemini JSON Response
// -----------------------------
const parseAiJson = (rawText: string) => {
  try {
    // remove markdown fences if Gemini sends them
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI response");
  }
};

// ===================================================
// Main Chat Service
// ===================================================
export const sendChatMessageService = async (
  userId: string,
  message: string,
  resumeId?: string
) => {
  // -----------------------------
  // Validate User
  // -----------------------------
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // -----------------------------
  // Free Plan Restriction
  // -----------------------------
  if (
    user.membership === "free" &&
    user.freeChatUsed === true
  ) {
    throw new Error(
      "Free chat limit used. Upgrade to premium."
    );
  }

  // -----------------------------
  // Existing Resume Fetch
  // -----------------------------
  let existingResume = null;

  if (resumeId) {
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new Error("Invalid resume id");
    }

    existingResume = await Resume.findOne({
      _id: resumeId,
      userId,
    });

    if (!existingResume) {
      throw new Error("Resume not found");
    }
  }

  // -----------------------------
  // Load Chat Memory
  // -----------------------------
  let history: any[] = [];

  if (existingResume) {
    history = await ChatMessage.find({
      resumeId: existingResume._id,
    })
      .sort({ createdAt: 1 })
      .limit(10)
      .select("role message -_id")
      .lean();
  }

  // -----------------------------
  // Build Prompt
  // -----------------------------
  const prompt = buildResumePrompt(
    message,
    existingResume?.data,
    history
  );

  // -----------------------------
  // Gemini Model Call
  // -----------------------------
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
  });

  const result = await model.generateContent(prompt);

  const rawText = result.response.text();

  const parsed = parseAiJson(rawText);

  if (!parsed?.resumeData) {
    throw new Error("Invalid AI response format");
  }

  // -----------------------------
  // Create / Update Resume
  // -----------------------------
  let resume;

  // Create / Update Resume
  if (existingResume) {
    // ✅ Spread merge — only override fields Gemini actually returned
    const existingData = (existingResume.data as Record<string, any>) || {};
    const newData = parsed.resumeData as Record<string, any>;

    existingResume.data = {
      ...existingData,
      ...newData,
      // For arrays: append new items, don't replace
      skills: newData.skills?.length
        ? [...new Set([...(existingData.skills || []), ...newData.skills])]
        : existingData.skills || [],
      experience: newData.experience?.length
        ? newData.experience
        : existingData.experience || [],
      projects: newData.projects?.length
        ? newData.projects
        : existingData.projects || [],
    };

    if (parsed.resumeData?.role && existingResume.title === "My Resume") {
      existingResume.title = parsed.resumeData.role;
    }

    existingResume.markModified("data"); // ← needed for Mongoose nested object changes
    await existingResume.save();
    resume = existingResume;
  } else {
    resume = await Resume.create({
      userId,
      title:
        parsed.resumeData?.role || "My Resume",
      data: parsed.resumeData,
    });
  }

  // -----------------------------
  // Save Chat History
  // -----------------------------
  await ChatMessage.create([
    {
      userId,
      resumeId: resume._id,
      role: "user",
      message,
    },
    {
      userId,
      resumeId: resume._id,
      role: "assistant",
      message:
        parsed.reply ||
        "Resume updated successfully",
    },
  ]);

  // -----------------------------
  // Consume Free Chat
  // -----------------------------
  if (
    user.membership === "free" &&
    user.freeChatUsed === false
  ) {
    user.freeChatUsed = true;
    await user.save();
  }

  // -----------------------------
  // Final Response
  // -----------------------------
  return {
    success: true,
    reply:
      parsed.reply ||
      "Resume updated successfully",
    resumeId: resume._id,
    resumeData: resume.data,
  };
};

export const getChatHistoryService = async (
  userId: string,
  resumeId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new Error("Invalid resume id");
  }

  // security check (resume owner only)
  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  const messages = await ChatMessage.find({
    resumeId,
  })
    .sort({ createdAt: 1 })
    .select("role message createdAt -_id");

  return messages;
};
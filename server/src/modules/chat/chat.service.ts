import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../auth/models/user.model";
import { Resume } from "../resume/models/resume.model";
import { buildResumePrompt } from "./chat.prompt";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export const sendChatMessageService = async (
  userId: string,
  message: string,
  resumeId?: string
) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (
    user.membership === "free" &&
    user.freeChatUsed === true
  ) {
    throw new Error("Free chat used. Upgrade to premium.");
  }

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

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
  });

  const prompt = buildResumePrompt(
    message,
    existingResume?.data
  );

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  let parsed = JSON.parse(text);

  let resume;

  if (existingResume) {
    existingResume.data = parsed.resumeData;
    await existingResume.save();
    resume = existingResume;
  } else {
    resume = await Resume.create({
      userId,
      title:
        parsed.resumeData.role || "My Resume",
      data: parsed.resumeData,
    });
  }

  if (
    user.membership === "free" &&
    user.freeChatUsed === false
  ) {
    user.freeChatUsed = true;
    await user.save();
  }

  return {
    reply: parsed.reply,
    resumeId: resume._id,
    resumeData: resume.data,
  };
};
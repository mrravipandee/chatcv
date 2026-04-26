import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../auth/models/user.model";
import { Resume } from "../resume/models/resume.model";
import { buildResumePrompt } from "./chat.prompt";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export const sendChatMessageService = async (
  userId: string,
  message: string
) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (
    user.membership === "free" &&
    user.freeChatUsed === true
  ) {
    throw new Error("Free chat limit used. Upgrade to premium.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
  });

  const prompt = buildResumePrompt(message);

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI parsing failed");
  }

  // Save Resume
  const resume = await Resume.create({
    userId,
    title:
      parsed.resumeData?.role || "My Resume",
    data: parsed.resumeData,
  });

  // consume free chat
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
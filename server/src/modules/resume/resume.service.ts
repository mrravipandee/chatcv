import { Resume } from "./models/resume.model";
import mongoose from "mongoose";
import { UpdateResumeInput } from "./resume.validation";

export const getMyResumesService = async (
  userId: string
) => {
  const resumes = await Resume.find({ userId })
    .sort({ updatedAt: -1 })
    .select("_id title isPublic createdAt updatedAt");

  return resumes;
};

export const getResumeByIdService = async (
  userId: string,
  resumeId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new Error("Invalid resume id");
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  return resume;
};

export const updateResumeService = async (
  userId: string,
  resumeId: string,
  payload: UpdateResumeInput
) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new Error("Invalid resume id");
  }

  const updated = await Resume.findOneAndUpdate(
    {
      _id: resumeId,
      userId,
    },
    {
      $set: payload,
    },
    {
      new: true,
    }
  );

  if (!updated) {
    throw new Error("Resume not found");
  }

  return updated;
};
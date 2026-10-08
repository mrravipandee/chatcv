import { Resume } from "./models/resume.model";
import mongoose from "mongoose";
import { UpdateResumeInput } from "./resume.validation";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { setCachedResume, invalidateResumeCache } from "../../config/redis.client";

export const createResumeService = async (
  userId: string
) => {
  const resume = await Resume.create({
    userId,
    title: "My Resume",
    data: {
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: [],
      experience: [],
      projects: [],
    },
  });

  return resume;
};

export const getMyResumesService = async (
  userId: string
) => {
  const resumes = await Resume.find({ userId })
    .sort({ updatedAt: -1 })
    .select("_id title isPublic data createdAt updatedAt");

  return resumes;
};

export const getResumeByIdService = async (
  userId: string,
  resumeId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new BadRequestError("Invalid resume id");
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  });

  if (!resume) {
    throw new NotFoundError("Resume not found");
  }

  return resume;
};

export const updateResumeService = async (
  userId: string,
  resumeId: string,
  payload: UpdateResumeInput
) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new BadRequestError("Invalid resume id");
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
    throw new NotFoundError("Resume not found");
  }

  // Invalidate and sync Redis cache with latest resume data
  if (updated.data) {
    setCachedResume(resumeId, updated.data).catch(() => {});
  } else {
    invalidateResumeCache(resumeId).catch(() => {});
  }

  return updated;
};
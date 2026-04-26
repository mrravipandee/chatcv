import { Resume } from "./models/resume.model";

export const getMyResumesService = async (
  userId: string
) => {
  const resumes = await Resume.find({ userId })
    .sort({ updatedAt: -1 })
    .select("_id title isPublic createdAt updatedAt");

  return resumes;
};
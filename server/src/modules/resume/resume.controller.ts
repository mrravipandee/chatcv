import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createResumeService, getMyResumesService } from "./resume.service";
import { getResumeByIdService } from "./resume.service";
import { updateResumeService } from "./resume.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const createResumeController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  const resume = await createResumeService(req.user!.id);

  return res.status(201).json({
    success: true,
    message: "Resume created successfully",
    data: resume,
  });
});

export const getMyResumesController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  const resumes = await getMyResumesService(req.user!.id);

  return res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes,
  });
});

export const getResumeByIdController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  const resume = await getResumeByIdService(
    req.user!.id,
    req.params.id as string
  );

  return res.status(200).json({
    success: true,
    data: resume,
  });
});

export const updateResumeController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  // Validation is handled prior via validateBody middleware
  const updated = await updateResumeService(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Resume updated successfully",
    data: updated,
  });
});
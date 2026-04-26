import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getMyResumesService } from "./resume.service";
import { getResumeByIdService } from "./resume.service";
import { updateResumeSchema } from "./resume.validation";
import { updateResumeService } from "./resume.service";

export const getMyResumesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resumes = await getMyResumesService(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

export const getResumeByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resume = await getResumeByIdService(
      req.user.id,
      req.params.id as string
    );

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateResumeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const validated = updateResumeSchema.parse(
      req.body
    );

    const updated = await updateResumeService(
      req.user.id,
      req.params.id as string,
      validated
    );

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error?.errors?.[0]?.message || error.message,
    });
  }
};
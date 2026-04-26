import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getMyResumesService } from "./resume.service";

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
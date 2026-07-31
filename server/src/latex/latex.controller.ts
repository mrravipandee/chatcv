import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateLatexPdf } from "./latex.service";
import { pdfStore } from "./pdf.store";
import { buildLatex } from "./latex.builder";
import { Resume } from "../modules/resume/models/resume.model";
import { ResumeDownload } from "../modules/resume/models/resume-download.model";
import { asyncHandler } from "../utils/asyncHandler";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";

// POST /api/latex/generate
// Body: { resumeId: string }
export const generateController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  const { resumeId } = req.body;

  if (!resumeId) {
    throw new BadRequestError("resumeId is required");
  }

  const jobId = await generateLatexPdf(req.user!.id, resumeId);

  return res.status(200).json({
    success: true,
    data: { jobId },
  });
});

// GET /api/latex/pdf/:jobId
export const downloadPdfController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rawJobId = req.params.jobId;
  const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;

  if (!jobId) {
    throw new BadRequestError("jobId is required");
  }

  const pdfBuffer = pdfStore.get(jobId);

  if (!pdfBuffer) {
    throw new NotFoundError("PDF not found or expired. Please generate again.");
  }

  // Record real-time resume download logs
  if (req.user) {
    ResumeDownload.create({
      userId: req.user.id,
      userEmail: req.user.email || "unknown@chatcv.com",
      format: "PDF",
      title: "AI Compiled Resume"
    }).catch((err) => console.error("[DOWNLOAD_LOG_ERROR]", err));
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="resume_${jobId.slice(0, 8)}.pdf"`
  );
  return res.send(pdfBuffer);
});

// GET /api/latex/preview/:resumeId
export const previewLatexController = asyncHandler(async (
  req: AuthRequest,
  res: Response
) => {
  const resume = await Resume.findOne({
    _id: req.params.resumeId,
    userId: req.user!.id,
  });

  if (!resume) {
    throw new NotFoundError("Resume not found");
  }

  const latex = buildLatex(resume.data as Record<string, any>);

  return res.status(200).json({ success: true, data: { latex } });
});
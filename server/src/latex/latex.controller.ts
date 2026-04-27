import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateLatexPdf } from "./latex.service";
import { pdfStore } from "./pdf.store";
import { buildLatex } from "./latex.builder";
import { Resume } from "../modules/resume/models/resume.model";

// POST /api/latex/generate
// Body: { resumeId: string }
// Starts background pipeline, returns jobId immediately
export const generateController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required",
      });
    }

    const jobId = await generateLatexPdf(req.user.id, resumeId);

    return res.status(200).json({
      success: true,
      data: { jobId },
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /api/latex/pdf/:jobId
// Returns compiled PDF binary
export const downloadPdfController = (req: AuthRequest, res: Response) => {
  const rawJobId = req.params.jobId;
  const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;

  if (!jobId) {
    return res.status(400).json({
      success: false,
      message: "jobId is required",
    });
  }

  const pdfBuffer = pdfStore.get(jobId);

  if (!pdfBuffer) {
    return res.status(404).json({
      success: false,
      message: "PDF not found or expired. Please generate again.",
    });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="resume_${jobId.slice(0, 8)}.pdf"`
  );
  return res.send(pdfBuffer);
};

// GET /api/latex/preview/:resumeId
// Returns raw LaTeX source for debugging
export const previewLatexController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const latex = buildLatex(resume.data as Record<string, any>);

    return res.status(200).json({ success: true, data: { latex } });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
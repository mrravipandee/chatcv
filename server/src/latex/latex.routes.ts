import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  generateController,
  downloadPdfController,
  previewLatexController,
} from "./latex.controller";

const router = Router();

// Start PDF generation (returns jobId, updates via WebSocket)
router.post("/generate", authMiddleware, generateController);

// Download compiled PDF by jobId
router.get("/pdf/:jobId", authMiddleware, downloadPdfController);

// Preview raw LaTeX source (useful for debugging)
router.get("/preview/:resumeId", authMiddleware, previewLatexController);

export default router;
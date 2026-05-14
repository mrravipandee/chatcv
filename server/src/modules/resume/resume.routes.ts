import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createResumeController,
  getMyResumesController,
  updateResumeController,
  getResumeByIdController,
} from "./resume.controller";
import { uploadResumeController } from "./upload.controller";

const router = Router();

router.post("/create", authMiddleware, createResumeController);
router.get("/my", authMiddleware, getMyResumesController);
router.get("/:id", authMiddleware, getResumeByIdController);
router.patch("/:id", authMiddleware, updateResumeController);

// Resume upload & AI extraction (multer handled inside controller)
router.post("/upload", authMiddleware, uploadResumeController as any);

export default router;
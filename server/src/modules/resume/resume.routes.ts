import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createResumeController, getMyResumesController, updateResumeController, getResumeByIdController } from "./resume.controller";

const router = Router();

router.post("/create", authMiddleware, createResumeController);
router.get("/my", authMiddleware, getMyResumesController);
router.get("/:id", authMiddleware, getResumeByIdController);
router.patch("/:id", authMiddleware, updateResumeController);

export default router;
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMyResumesController, updateResumeController, getResumeByIdController } from "./resume.controller";

const router = Router();

router.get("/my", authMiddleware, getMyResumesController);
router.get("/:id", authMiddleware, getResumeByIdController);
router.patch("/:id", authMiddleware, updateResumeController);

export default router;
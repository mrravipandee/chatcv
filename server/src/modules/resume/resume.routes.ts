import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMyResumesController } from "./resume.controller";
import { getResumeByIdController } from "./resume.controller";

const router = Router();

router.get("/my", authMiddleware, getMyResumesController);
router.get("/:id", authMiddleware, getResumeByIdController);

export default router;
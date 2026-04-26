import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMyResumesController } from "./resume.controller";

const router = Router();

router.get("/my", authMiddleware, getMyResumesController);

export default router;
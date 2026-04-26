import { Router } from "express";

import {
  getMeController,
  loginUserController,
  registerUserController,
  verifyOtpController,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUserController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginUserController);
router.get("/me", authMiddleware, getMeController);

export default router;
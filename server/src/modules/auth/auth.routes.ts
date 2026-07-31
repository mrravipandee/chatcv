import { Router } from "express";

import {
  getMeController,
  loginUserController,
  registerUserController,
  verifyOtpController,
  updateProfileController,
  changePasswordController,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, verifyOtpSchema, loginSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), registerUserController);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtpController);
router.post("/login", validate(loginSchema), loginUserController);
router.get("/me", authMiddleware, getMeController);
router.put("/update-profile", authMiddleware, updateProfileController as any);
router.post("/change-password", authMiddleware, changePasswordController as any);

export default router;
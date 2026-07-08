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

const router = Router();

router.post("/register", registerUserController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginUserController);
router.get("/me", authMiddleware, getMeController);
router.put("/update-profile", authMiddleware, updateProfileController as any);
router.post("/change-password", authMiddleware, changePasswordController as any);

export default router;
import { Request, Response } from "express";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "./auth.validation";

import {
  loginUserService,
  registerUserService,
  verifyOtpService,
  updateProfileService,
  changePasswordService,
} from "./auth.service";

import { 
  AuthRequest
 } from "../../middlewares/auth.middleware";
import { 
  User 
} from "./models/user.model";

export const registerUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = registerSchema.parse(req.body);

    const result = await registerUserService(validated);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.errors?.[0]?.message || error.message,
    });
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = verifyOtpSchema.parse(req.body);

    const result = await verifyOtpService(validated);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.errors?.[0]?.message || error.message,
    });
  }
};

export const loginUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = loginSchema.parse(req.body);

    const result = await loginUserService(validated);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.errors?.[0]?.message || error.message,
    });
  }
};

export const getMeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-passwordHash").lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name || "",
        email: user.email,
        membership: user.membership,
        chatTokensUsed: user.chatTokensUsed ?? 0,
        chatTokensLimit: user.chatTokensLimit ?? 5,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

export const updateProfileController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name } = req.body as { name?: string };
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const updatedUser = await updateProfileService(req.user.id, name);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePasswordController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    const result = await changePasswordService(
      req.user.id,
      currentPassword || "",
      newPassword
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
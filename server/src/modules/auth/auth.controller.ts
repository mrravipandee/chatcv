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

    const user = await User.findById(userId).select("-passwordHash");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
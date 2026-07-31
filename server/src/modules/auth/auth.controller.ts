import { Response } from "express";
import {
  loginUserService,
  registerUserService,
  verifyOtpService,
  updateProfileService,
  changePasswordService,
} from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { User } from "./models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { NotFoundError } from "../../errors/NotFoundError";

export const registerUserController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Validation is handled prior via validateBody middleware
    const result = await registerUserService(req.body);
    return res.status(200).json(result);
  }
);

export const verifyOtpController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Validation is handled prior via validateBody middleware
    const result = await verifyOtpService(req.body);
    return res.status(200).json(result);
  }
);

export const loginUserController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Validation is handled prior via validateBody middleware
    const result = await loginUserService(req.body);
    return res.status(200).json(result);
  }
);

export const getMeController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const user = await User.findById(userId).select("-passwordHash").lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        _id: user._id,
        name: user.name || "",
        email: user.email,
        membership: user.membership,
        role: (user as any).role || "user",
        chatTokensUsed: user.chatTokensUsed ?? 0,
        chatTokensLimit: user.chatTokensLimit ?? 5,
      },
    });
  }
);

export const updateProfileController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name } = req.body as { name?: string };
    if (!name) {
      throw new NotFoundError("Name is required");
    }

    const updatedUser = await updateProfileService(req.user!.id, name);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  }
);

export const changePasswordController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!newPassword) {
      throw new NotFoundError("New password is required");
    }

    const result = await changePasswordService(
      req.user!.id,
      currentPassword || "",
      newPassword
    );

    return res.status(200).json(result);
  }
);
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { chatSchema } from "./chat.validation";
import { sendChatMessageService } from "./chat.service";

export const sendChatController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const validated = chatSchema.parse(req.body);

    const result = await sendChatMessageService(
      req.user.id,
      validated.message
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

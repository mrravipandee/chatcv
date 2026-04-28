import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { chatSchema } from './chat.validation';
import { sendChatMessageService, getChatHistoryService } from './chat.service';

export const sendChatController = async (req: AuthRequest, res: Response) => {
  try {
    const validated = chatSchema.parse(req.body);
    const result = await sendChatMessageService(
      req.user.id,
      validated.message,
      validated.resumeId
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).json({ success: false, message });
  }
};

export const getChatHistoryController = async (req: AuthRequest, res: Response) => {
  try {
    const resumeIdParam = req.params.resumeId;
    // ✅ Convert possible array to string
    const resumeId = Array.isArray(resumeIdParam) ? resumeIdParam[0] : resumeIdParam;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'Missing resumeId parameter' });
    }

    const messages = await getChatHistoryService(req.user.id, resumeId);
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).json({ success: false, message });
  }
};
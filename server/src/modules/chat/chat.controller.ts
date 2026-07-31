import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendChatMessageService, getChatHistoryService } from './chat.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { BadRequestError } from '../../errors/BadRequestError';

export const sendChatController = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Validation is handled prior via validateBody middleware
  const result = await sendChatMessageService(
    req.user!.id,
    req.body.message,
    req.body.resumeId
  );
  return res.status(200).json({ success: true, data: result });
});

export const getChatHistoryController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const resumeIdParam = req.params.resumeId;
  const resumeId = Array.isArray(resumeIdParam) ? resumeIdParam[0] : resumeIdParam;

  if (!resumeId) {
    throw new BadRequestError('Missing resumeId parameter');
  }

  const messages = await getChatHistoryService(req.user!.id, resumeId);
  return res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getChatHistoryController, sendChatController } from './chat.controller';
import { validate } from '../../middlewares/validate.middleware';
import { chatSchema } from './chat.validation';

const router = Router();

router.get('/:resumeId/history', authMiddleware, getChatHistoryController);
router.post('/message', authMiddleware, validate(chatSchema), sendChatController);

export default router;
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getChatHistoryController, sendChatController } from './chat.controller';

const router = Router();

router.get('/:resumeId/history', authMiddleware, getChatHistoryController);
router.post('/message', authMiddleware, sendChatController);

export default router;
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  getPlansController,
  createOrderController,
  verifyPaymentController,
  dodoWebhookController,
} from './payment.controller';

const router = Router();

// Public — anyone can see plans
router.get('/plans', getPlansController as any);

// Dodo Payments webhook — no auth (verified by signature)
router.post('/webhook', dodoWebhookController as any);

// Authenticated
router.post('/create-order', authMiddleware, createOrderController as any);
router.post('/verify', authMiddleware, verifyPaymentController as any);

export default router;

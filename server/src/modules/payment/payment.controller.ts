import { Response, Request } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import {
  createPaymentOrderService,
  completePaymentService,
  handleDodoWebhook,
  getPlansService,
} from './payment.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { BadRequestError } from '../../errors/BadRequestError';

export const getPlansController = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const plans = getPlansService();
  return res.status(200).json({ success: true, data: plans });
});

export const createOrderController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { planId } = req.body as { planId?: string };
  if (!planId) {
    throw new BadRequestError('planId is required');
  }

  const result = await createPaymentOrderService(req.user!.id, planId);
  return res.status(200).json({ success: true, data: result });
});

// Called after user returns from Dodo checkout page
export const verifyPaymentController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.body as { sessionId?: string };
  if (!sessionId) {
    throw new BadRequestError('sessionId is required');
  }

  const result = await completePaymentService(sessionId, req.user!.id);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      tokensAdded: result.tokensAdded,
      newLimit: result.newLimit,
      newUsed: result.newUsed,
    },
  });
});

// Dodo Payments webhook (unauthenticated — signed by Dodo)
export const dodoWebhookController = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Add Dodo webhook signature verification here when you set up
  // the webhook secret in your Dodo dashboard + DODO_WEBHOOK_SECRET in .env
  const payload = req.body as Record<string, unknown>;
  await handleDodoWebhook(payload);
  return res.status(200).json({ received: true });
});

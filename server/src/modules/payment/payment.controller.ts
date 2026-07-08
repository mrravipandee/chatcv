import { Response, Request } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import {
  createPaymentOrderService,
  completePaymentService,
  handleDodoWebhook,
  getPlansService,
} from './payment.service';

export const getPlansController = async (_req: AuthRequest, res: Response) => {
  try {
    const plans = getPlansService();
    return res.status(200).json({ success: true, data: plans });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ success: false, message });
  }
};

export const createOrderController = async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.body as { planId?: string };
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    const result = await createPaymentOrderService(req.user.id, planId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PAYMENT] createOrder error:', message);
    return res.status(400).json({ success: false, message });
  }
};

// Called after user returns from Dodo checkout page
export const verifyPaymentController = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    const result = await completePaymentService(sessionId, req.user.id);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        tokensAdded: result.tokensAdded,
        newLimit: result.newLimit,
        newUsed: result.newUsed,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PAYMENT] verify error:', message);
    return res.status(400).json({ success: false, message });
  }
};

// Dodo Payments webhook (unauthenticated — signed by Dodo)
export const dodoWebhookController = async (req: Request, res: Response) => {
  try {
    // TODO: Add Dodo webhook signature verification here when you set up
    // the webhook secret in your Dodo dashboard + DODO_WEBHOOK_SECRET in .env
    const payload = req.body as Record<string, unknown>;
    await handleDodoWebhook(payload);
    return res.status(200).json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    console.error('[PAYMENT] webhook error:', message);
    return res.status(400).json({ success: false, message });
  }
};

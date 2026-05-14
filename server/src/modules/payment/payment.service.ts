import DodoPayments from 'dodopayments';
import { User } from '../auth/models/user.model';
import { Payment, PlanId } from './payment.model';
import { syncTokensToRedis } from '../../config/redis.client';

// ── Plan config ───────────────────────────────────────────────────────────────

export interface Plan {
  id: PlanId;
  label: string;
  tokens: number;
  price: number;       // in smallest currency unit (paise for INR)
  priceDisplay: string;
  // Dodo Payments product IDs — set these in your Dodo dashboard
  productId: string;
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    label: '49 Chats',
    tokens: 49,
    price: 19900,       // ₹199
    priceDisplay: '₹199',
    productId: process.env.DODO_PRODUCT_BASIC || 'prod_basic_placeholder',
  },
  {
    id: 'pro',
    label: '99 Chats',
    tokens: 99,
    price: 24900,       // ₹249
    priceDisplay: '₹249',
    productId: process.env.DODO_PRODUCT_PRO || 'prod_pro_placeholder',
  },
];

function getPlan(planId: string): Plan {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Invalid plan: ${planId}`);
  return plan;
}

// ── Lazily initialize Dodo client ─────────────────────────────────────────────

function getDodoClient(): DodoPayments {
  const apiKey = process.env.DODO_API_KEY;
  if (!apiKey) throw new Error('DODO_API_KEY is not set in environment');

  const env = process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode';

  return new DodoPayments({
    bearerToken: apiKey,
    environment: env,
  });
}

// ── Create Checkout Session ───────────────────────────────────────────────────

export async function createPaymentOrderService(userId: string, planId: string) {
  const plan = getPlan(planId);
  const dodo = getDodoClient();

  // Fetch user email for prefill
  const user = await User.findById(userId).select('email name').lean();
  if (!user) throw new Error('User not found');

  // Create a Dodo Payments checkout session
  const session = await (dodo as any).checkoutSessions.create({
    product_cart: [{ product_id: plan.productId, quantity: 1 }],
    payment_link: true,
    billing: {
      email: user.email,
      name: user.name || '',
    },
    metadata: {
      userId,
      planId: plan.id,
      tokens: String(plan.tokens),
    },
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/billing?success=1`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/billing?cancelled=1`,
  });

  // Record pending payment
  await Payment.create({
    userId,
    planId: plan.id,
    tokens: plan.tokens,
    amount: plan.price,
    orderId: session.id,
    status: 'pending',
  });

  return {
    checkoutUrl: session.checkout_url as string,
    sessionId: session.id as string,
    planLabel: plan.label,
    tokens: plan.tokens,
    amount: plan.priceDisplay,
  };
}

// ── Verify / Complete Payment (called by webhook or polling) ──────────────────

export async function completePaymentService(
  sessionId: string,
  userId: string
): Promise<{
  success: boolean;
  message: string;
  tokensAdded?: number;
  newLimit?: number;
  alreadyDone?: boolean;
}> {
  const payment = await Payment.findOne({ orderId: sessionId });

  if (!payment) throw new Error('Payment record not found');
  if (payment.userId.toString() !== userId) throw new Error('Access denied');

  if (payment.status === 'success') {
    return { success: true, message: 'Payment already processed', alreadyDone: true };
  }

  // Verify with Dodo that the session is actually paid
  const dodo = getDodoClient();
  let session: { status?: string; id?: string };

  try {
    session = await (dodo as any).checkoutSessions.retrieve(sessionId);
  } catch (err) {
    throw new Error(`Failed to verify payment with Dodo: ${err instanceof Error ? err.message : 'unknown'}`);
  }

  if (session.status !== 'succeeded' && session.status !== 'paid') {
    throw new Error(`Payment not completed. Status: ${session.status}`);
  }

  // Mark payment as success
  payment.status = 'success';
  payment.paymentId = sessionId;
  await payment.save();

  // Add tokens to user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { chatTokensLimit: payment.tokens } },
    { new: true }
  );

  if (!updatedUser) throw new Error('User not found after payment');

  syncTokensToRedis(userId, updatedUser.chatTokensUsed).catch(() => {});

  return {
    success: true,
    message: `Payment verified! ${payment.tokens} chats added to your account.`,
    tokensAdded: payment.tokens,
    newLimit: updatedUser.chatTokensLimit,
  };
}

// ── Webhook handler ───────────────────────────────────────────────────────────

export async function handleDodoWebhook(
  payload: Record<string, unknown>
): Promise<void> {
  const event = payload.type as string;
  const data = payload.data as Record<string, unknown>;

  console.log('[PAYMENT] Dodo webhook:', event);

  if (event === 'payment.succeeded' || event === 'checkout.session.completed') {
    const sessionId = (data?.id || data?.session_id) as string;
    const metadata = (data?.metadata || {}) as Record<string, string>;
    const userId = metadata.userId;

    if (!sessionId || !userId) {
      console.warn('[PAYMENT] Webhook missing sessionId or userId');
      return;
    }

    try {
      const result = await completePaymentService(sessionId, userId);
      console.log('[PAYMENT] Webhook completed:', result.message);
    } catch (err) {
      console.error('[PAYMENT] Webhook error:', err instanceof Error ? err.message : err);
    }
  }
}

// ── Get Plans ─────────────────────────────────────────────────────────────────

export function getPlansService() {
  return PLANS.map(({ id, label, tokens, priceDisplay }) => ({
    id,
    label,
    tokens,
    price: priceDisplay,
  }));
}

import { DodoPayments } from 'dodopayments';
import { User } from '../auth/models/user.model';
import { Subscription } from './models/subscription.model';

const apiKey = process.env.DODO_PAYMENTS_API_KEY;

export const dodoClient = new DodoPayments({
  bearerToken: apiKey || '',
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

export const createCheckoutSession = async (userId: string, planId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Create Checkout Session using Dodo Payments SDK
  const session = await dodoClient.checkoutSessions.create({
    product_cart: [
      {
        product_id: planId,
        quantity: 1,
      },
    ],
    customer: {
      email: user.email,
      name: user.name || user.email.split('@')[0],
    },
    metadata: {
      userId: user._id.toString(),
      plan: 'pro',
    },
    return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/settings?status=success`,
  });

  return {
    url: session.checkout_url,
  };
};

export const cancelUserSubscription = async (userId: string) => {
  const subscription = await Subscription.findOne({ userId, status: 'active' });
  if (!subscription) {
    throw new Error('No active subscription found to cancel');
  }

  // Call Dodo Payments update API to cancel subscription immediately
  await dodoClient.subscriptions.update(subscription.subscriptionId, {
    status: 'cancelled',
    cancel_reason: 'cancelled_by_customer',
  });

  // Update subscription in database
  subscription.status = 'cancelled';
  await subscription.save();

  // Downgrade user access
  await User.findByIdAndUpdate(userId, {
    plan: 'free',
    subscriptionStatus: 'cancelled',
    membership: 'free',
  });

  return {
    success: true,
    message: 'Subscription cancelled successfully',
  };
};

export const getSubscriptionInfoService = async (userId: string) => {
  const subscription = await Subscription.findOne({ userId }).sort({ updatedAt: -1 });
  return subscription;
};

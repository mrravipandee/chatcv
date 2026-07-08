export interface CreateCheckoutPayload {
  planId: string;
}

export interface WebhookEvent {
  type:
    | 'subscription.created'
    | 'subscription.updated'
    | 'subscription.cancelled'
    | 'payment.succeeded'
    | 'payment.failed';
  data: {
    id: string; // Subscription ID or Payment ID
    status: string;
    customer?: {
      id: string;
      email?: string;
      name?: string;
      metadata?: Record<string, any>;
    };
    metadata?: {
      userId?: string;
      plan?: string;
      [key: string]: any;
    };
    current_period_end?: string | number | null;
    cancel_at_period_end?: boolean;
    cancel_at_next_billing_date?: boolean;
    [key: string]: any;
  };
}

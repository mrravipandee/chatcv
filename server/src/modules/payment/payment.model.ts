import mongoose, { Schema, Document, Types } from 'mongoose';

export type PlanId = 'basic' | 'pro';

export interface IPayment extends Document {
  userId: Types.ObjectId;
  planId: PlanId;
  tokens: number;
  amount: number; // in paise (INR)
  orderId: string;
  paymentId?: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, enum: ['basic', 'pro'], required: true },
    tokens: { type: Number, required: true },
    amount: { type: Number, required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

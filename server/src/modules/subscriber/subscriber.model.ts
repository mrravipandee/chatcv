import mongoose, { Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new mongoose.Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      default: "landing_page",
    },
  },
  { timestamps: true }
);

export const Subscriber = mongoose.model<ISubscriber>(
  "Subscriber",
  subscriberSchema
);
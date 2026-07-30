import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  email: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

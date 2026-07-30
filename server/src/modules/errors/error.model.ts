import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemError extends Document {
  error: string;
  path: string;
  count: number;
  status: 'active' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const SystemErrorSchema = new Schema<ISystemError>(
  {
    error: { type: String, required: true, trim: true },
    path: { type: String, required: true, index: true },
    count: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'resolved'], default: 'active', index: true }
  },
  { timestamps: true }
);

SystemErrorSchema.index({ updatedAt: -1 });

export const SystemError = mongoose.model<ISystemError>('SystemError', SystemErrorSchema);

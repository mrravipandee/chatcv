import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  message: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
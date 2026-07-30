import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: 'read' | 'unread' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['read', 'unread', 'replied'], default: 'unread', index: true }
  },
  { timestamps: true }
);

ContactMessageSchema.index({ createdAt: -1 });

export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeDownload extends Document {
  userId?: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  title: string;
  format: 'PDF' | 'LaTeX' | 'JSON';
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeDownloadSchema = new Schema<IResumeDownload>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', index: true },
    title: { type: String, default: 'My Resume', trim: true },
    format: { type: String, enum: ['PDF', 'LaTeX', 'JSON'], default: 'PDF', index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true }
  },
  { timestamps: true }
);

ResumeDownloadSchema.index({ createdAt: -1 });

export const ResumeDownload = mongoose.model<IResumeDownload>('ResumeDownload', ResumeDownloadSchema);

import { Schema, model, Document, Types } from "mongoose";

export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  data: any;
  isPublic: boolean;
  publicSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "My Resume",
    },

    data: {
      type: Schema.Types.Mixed,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    publicSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export const Resume = model<IResume>(
  "Resume",
  resumeSchema
);
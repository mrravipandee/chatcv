import { Schema, model, Document } from "mongoose";

export interface IPendingUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const pendingUserSchema = new Schema<IPendingUser>(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const PendingUser = model<IPendingUser>(
  "PendingUser",
  pendingUserSchema
);
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  provider: 'email' | 'google';
  googleId?: string;
  isVerified: boolean;
  membership: 'free' | 'premium';
  chatTokensUsed: number;
  chatTokensLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
    },

    provider: {
      type: String,
      default: 'email',
    },

    googleId: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    membership: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },

    // Number of chat messages used (replaces freeChatUsed boolean)
    chatTokensUsed: {
      type: Number,
      default: 0,
    },

    // Allowed chat limit (5 free, increases with purchases)
    chatTokensLimit: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', UserSchema);
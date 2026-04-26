import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    provider: "email" | "google";
    googleId?: string;
    isVerified: boolean;
    membership: "free" | "premium";
    freeChatUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    passwordHash: {
        type: String,
    },

    provider: {
        type: String,
        default: "email",
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
        enum: ["free", "premium"],
        default: "free",
    },

    freeChatUsed: {
        type: Boolean,
        default: false,
    },
    
}, {
    timestamps: true,
});

export const User = model<IUser>('User', UserSchema);
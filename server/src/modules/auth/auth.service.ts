import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model";
import { PendingUser } from "./models/pending-user.model";
import { RegisterInput, VerifyOtpInput } from "./auth.validation";
import { sendEmail } from "../email/email.service";
import { LoginInput } from "./auth.validation";
import { syncTokensToRedis } from "../../config/redis.client";

const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUserService = async (payload: RegisterInput) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists. Please login.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const otp = generateOtp();

  // remove previous pending request
  await PendingUser.deleteOne({ email });

  await PendingUser.create({
    email,
    passwordHash,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    // Store name temporarily in pending user
    name: name.trim(),
  });

  await sendEmail(
    email,
    "Verify your ChatCV account 🔐",
    `
      <div style="font-family:Arial,sans-serif;padding:20px;background:#0a0a0a;color:#fff;border-radius:12px;">
        <h2 style="color:#00ff9c;">Welcome to ChatCV 🚀</h2>
        <p>Hi ${name.trim()}, use the OTP below to verify your account:</p>

        <div style="
          font-size:36px;
          font-weight:bold;
          letter-spacing:8px;
          color:#00ff9c;
          margin:24px 0;
          padding:16px;
          background:#111;
          border-radius:8px;
          text-align:center;
          border:1px solid #00ff9c33;
        ">
          ${otp}
        </div>

        <p>This OTP expires in <b>10 minutes</b>.</p>
        <p>If you didn't request this, ignore this email.</p>

        <br/>
        <p style="color:#00ff9c;">Team ChatCV 💚</p>
      </div>
    `
  );

  return {
    success: true,
    message: "OTP sent successfully to your email",
  };
};

export const verifyOtpService = async (payload: VerifyOtpInput) => {
  const { email, otp } = payload;

  const pendingUser = await PendingUser.findOne({ email });

  if (!pendingUser) {
    throw new Error("Verification expired. Please register again.");
  }

  if (pendingUser.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const newUser = await User.create({
    name: (pendingUser as any).name || "",
    email: pendingUser.email,
    passwordHash: pendingUser.passwordHash,
    provider: "email",
    isVerified: true,
    membership: "free",
    chatTokensUsed: 0,
    chatTokensLimit: 5,
  });

  // Sync initial token count to Redis (non-blocking)
  syncTokensToRedis(newUser._id.toString(), 0).catch(() => {});

  await PendingUser.deleteOne({ email });

  return {
    success: true,
    message: "Account verified successfully",
  };
};

export const loginUserService = async (payload: LoginInput) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.provider !== "email") {
    throw new Error("Please login with Google");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.passwordHash as string
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Sync DB token count to Redis (non-blocking)
  syncTokensToRedis(user._id.toString(), user.chatTokensUsed).catch(() => {});

  const jwtSecret = process.env.JWT_SECRET as Secret;
  const jwtExpiresIn = (process.env.JWT_EXPIRES || "7d") as SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      membership: user.membership,
    },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn,
    }
  );

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      membership: user.membership,
      chatTokensUsed: user.chatTokensUsed,
      chatTokensLimit: user.chatTokensLimit,
    },
  };
};

export const updateProfileService = async (userId: string, name: string) => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    throw new Error("Name must be at least 2 characters");
  }
  if (trimmedName.length > 60) {
    throw new Error("Name too long");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name: trimmedName },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    membership: user.membership,
    chatTokensUsed: user.chatTokensUsed,
    chatTokensLimit: user.chatTokensLimit,
  };
};

export const changePasswordService = async (
  userId: string,
  currentPass: string,
  newPass: string
) => {
  if (newPass.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.provider === "email" || user.passwordHash) {
    if (!user.passwordHash) {
      throw new Error("Invalid account configuration");
    }
    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new Error("Current password incorrect");
    }
  }

  const newHash = await bcrypt.hash(newPass, 10);
  user.passwordHash = newHash;
  await user.save();

  return { success: true, message: "Password updated successfully" };
};
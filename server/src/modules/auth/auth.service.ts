import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model";
import { PendingUser } from "./models/pending-user.model";
import { RegisterInput, VerifyOtpInput } from "./auth.validation";
import { sendEmail } from "../email/email.service";
import { LoginInput } from "./auth.validation";

const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUserService = async (payload: RegisterInput) => {
  const { email, password } = payload;

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
  });

  // ✅ your nodemailer function
  await sendEmail(
    email,
    "Verify your ChatCV account 🔐",
    `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Welcome to ChatCV 🚀</h2>
        <p>Use the OTP below to verify your account:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:6px;
          color:#00ff9c;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>This OTP expires in <b>10 minutes</b>.</p>
        <p>If you didn’t request this, ignore this email.</p>

        <br/>
        <p>Team ChatCV 💚</p>
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

  await User.create({
    email: pendingUser.email,
    passwordHash: pendingUser.passwordHash,
    provider: "email",
    isVerified: true,
    membership: "free",
    freeChatUsed: false,
  });

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
      email: user.email,
      membership: user.membership,
      freeChatUsed: user.freeChatUsed,
    },
  };
};
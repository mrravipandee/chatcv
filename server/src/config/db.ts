import mongoose from "mongoose";

type NodeLikeGlobal = {
  process?: {
    env?: {
      MONGO_URI?: string;
    };
  };
};

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = (globalThis as NodeLikeGlobal).process?.env?.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoUri);
    console.log("DB Connected");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
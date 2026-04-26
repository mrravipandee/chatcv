import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT}`);
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("[SERVER] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
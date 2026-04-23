import dotenv from "dotenv";

// Load environment variables FIRST, before importing anything else
dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const start = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("[ERROR] Failed to start server:", err);
  process.exit(1);
});
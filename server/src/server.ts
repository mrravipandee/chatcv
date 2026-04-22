import dotenv from "dotenv";

// Load environment variables FIRST, before importing anything else
dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const start = async () => {
  await connectDB();

  app.listen(5001, () => {
    console.log("Server running on port 5001");
  });
};

start();
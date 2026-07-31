import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import subscriberRoutes from "./modules/subscriber/subscriber.routes";
import authRoutes from "./modules/auth/auth.routes";
import chatRoutes from "./modules/chat/chat.routes";
import resumeRoutes from "./modules/resume/resume.routes";
import latexRoutes from "./latex/latex.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import adminRoutes from "./modules/admin/admin.routes";
import visitorRoutes from "./modules/visitors/visitor.routes";

export const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://chatcv-gamma.vercel.app",
  "https://resumebuilder-chatcv.vercel.app",
  "https://chatcvapp.com",
  "https://www.chatcvapp.com",
];

if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(",").map((o) => o.trim());
  allowedOrigins.push(...envOrigins);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  console.log("[CORS] Allowed origins:", allowedOrigins);
}

app.use("/api", subscriberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/latex", latexRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/visitors", visitorRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
    path: req.path,
  });
});

import { errorMiddleware } from "./middlewares/error.middleware";

app.use(errorMiddleware);
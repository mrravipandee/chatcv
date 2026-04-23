import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import subscriberRoutes from "./modules/subscriber/subscriber.routes";

export const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", subscriberRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
    path: req.path,
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR]", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    details: process.env.NODE_ENV === "development" ? { error: error.message } : undefined,
  });
});
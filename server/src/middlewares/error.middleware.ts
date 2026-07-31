import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";
import { ValidationError, ValidationErrorDetail } from "../errors/ValidationError";
import { SystemError } from "../modules/errors/error.model";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let errorCode = error.errorCode || "INTERNAL_SERVER_ERROR";
  let message = error.message || "Internal server error";
  let details: any = undefined;
  let isOperational = error.isOperational ?? false;

  // 1. Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = "Validation failed";
    isOperational = true;
    details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }
  // 2. Handle Mongoose validation errors
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = "Validation failed";
    isOperational = true;
    const validationDetails: ValidationErrorDetail[] = [];
    Object.keys(error.errors).forEach((key) => {
      validationDetails.push({
        field: key,
        message: error.errors[key].message,
      });
    });
    details = validationDetails;
  }
  // 3. Handle Mongoose CastError
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    errorCode = "BAD_REQUEST";
    message = `Invalid value for path: ${error.path}`;
    isOperational = true;
  }
  // 4. Handle Mongoose Duplicate Key Error (code 11000)
  else if (error.code === 11000) {
    statusCode = 409;
    errorCode = "CONFLICT_ERROR";
    isOperational = true;
    const keys = Object.keys(error.keyValue || {});
    if (keys.length > 0) {
      message = `A record with this ${keys[0]} already exists`;
      details = [
        {
          field: keys[0],
          message: `The value '${error.keyValue[keys[0]]}' is already in use`,
        },
      ];
    } else {
      message = "Resource duplicate collision occurred";
    }
  }
  // 5. Handle JWT Signature Error
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    errorCode = "UNAUTHENTICATED";
    message = "Invalid auth token provided";
    isOperational = true;
  }
  // 6. Handle JWT Expiration Error
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    errorCode = "TOKEN_EXPIRED";
    message = "Authentication token expired";
    isOperational = true;
  }
  // 7. Handle Custom AppError with Details
  else if (error instanceof AppError) {
    isOperational = error.isOperational;
    if (error instanceof ValidationError) {
      details = error.details;
    }
  }

  // ── Logging Unexpected Errors & Writing DB SystemLogs ──────────────────────
  const timestamp = new Date().toISOString();
  const userId = (req as any).user?.id || (req as any).user?._id || "anonymous";
  const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const browser = req.headers["user-agent"] || "unknown";
  const requestId = req.headers["x-request-id"] || `req-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  // Log to database SystemError collection for active admin console analytics (required function persistence)
  SystemError.findOneAndUpdate(
    { error: message, path: req.path, status: 'active' },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  ).catch((err) => console.error('[ERROR_LOG_FAIL]', err));

  // Log to stdout/stderr if it is an unexpected/non-operational server exception
  if (!isOperational) {
    console.error(
      `[CRITICAL_ERROR] [${timestamp}] [RequestId: ${requestId}] [User: ${userId}] ` +
      `[ClientIP: ${ipAddress}] [Browser: ${browser}] [Method: ${req.method}] [Path: ${req.path}]\n` +
      `Message: ${error.message}\n` +
      `Stack: ${error.stack || "No stack trace available"}`
    );
  }

  // ── Sending standard response ──────────────────────────────────────────────
  const showStack = process.env.NODE_ENV === "development" && !isOperational;

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: {
      code: errorCode,
      message,
      details,
      stack: showStack ? error.stack : undefined,
    },
    timestamp,
    path: req.path,
  });
};

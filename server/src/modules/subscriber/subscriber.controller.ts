import { Request, Response } from "express";
import { addSubscriber } from "./subscriber.service";
import { subscribeSchema } from "./subscriber.validation";
import { checkRateLimit } from "./subscriber.rateLimit";
import { ZodError } from "zod";

interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: Record<string, any>;
}

interface SuccessResponse {
  success: true;
  message: string;
  data?: Record<string, any>;
}

export const subscribeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("[SUBSCRIBE] Request received from:", req.headers.origin);
    console.log("[SUBSCRIBE] Request body:", req.body);
    
    // Check rate limit first
    const rateLimit = checkRateLimit(req);
    
    if (!rateLimit.allowed) {
      const response: ErrorResponse = {
        success: false,
        message: `Too many subscription requests. You can subscribe 5 times per 24 hours. Try again after ${rateLimit.resetTime.toISOString()}`,
        code: "RATE_LIMIT_EXCEEDED",
        details: {
          resetTime: rateLimit.resetTime.toISOString(),
          limit: 5,
          window: "24h",
        },
      };
      res.status(429).json(response);
      return;
    }

    // Validate email input
    const parsed = subscribeSchema.parse(req.body);

    // Add subscriber
    const result = await addSubscriber(parsed.email);

    const response: SuccessResponse = {
      success: true,
      message: result.message,
      data: {
        email: result.data?.email,
        createdAt: result.data?.createdAt,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    let statusCode = 500;
    let message = "Internal server error";
    let code = "INTERNAL_ERROR";
    let details: Record<string, any> = {};

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      statusCode = 400;
      code = "VALIDATION_ERROR";
      message = "Invalid input provided";
      details = {
        errors: (error as ZodError).issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      };
    }
    // Handle duplicate email (already subscribed)
    else if (error.message?.includes("duplicate") || error.code === 11000) {
      statusCode = 409;
      code = "EMAIL_ALREADY_SUBSCRIBED";
      message = "This email is already subscribed";
    }
    // Handle other known errors
    else if (error.message) {
      statusCode = 400;
      code = "SUBSCRIPTION_ERROR";
      message = error.message;
    }

    const response: ErrorResponse = {
      success: false,
      message,
      code,
      details: Object.keys(details).length > 0 ? details : undefined,
    };

    res.status(statusCode).json(response);
  }
};
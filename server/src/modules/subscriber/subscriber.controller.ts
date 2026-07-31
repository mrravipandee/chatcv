import { Request, Response } from "express";
import { addSubscriber } from "./subscriber.service";
import { checkRateLimit } from "./subscriber.rateLimit";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../errors/AppError";

export const subscribeUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Check rate limit
  const rateLimit = checkRateLimit(req);
  
  if (!rateLimit.allowed) {
    throw new AppError(
      429,
      "RATE_LIMIT_EXCEEDED",
      `Too many subscription requests. You can subscribe 5 times per 24 hours. Try again after ${rateLimit.resetTime.toISOString()}`
    );
  }

  // Add subscriber (Validation is done via validateBody middleware prior to this)
  const result = await addSubscriber(req.body.email);

  res.status(201).json({
    success: true,
    message: result.message,
    data: {
      email: result.data?.email,
      createdAt: result.data?.createdAt,
    },
  });
});
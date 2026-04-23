import { z } from "zod";

export const subscribeSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must not exceed 255 characters")
    .transform((email) => email.toLowerCase().trim()),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
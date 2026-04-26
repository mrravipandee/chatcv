import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().min(2, "Message required"),
});

export type ChatInput = z.infer<typeof chatSchema>;
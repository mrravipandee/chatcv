import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().min(2),
  resumeId: z.string().optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;
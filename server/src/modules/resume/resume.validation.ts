import { z } from "zod";

export const updateResumeSchema = z.object({
  title: z.string().min(1).optional(),
  data: z.any().optional(),
});

export type UpdateResumeInput = z.infer<
  typeof updateResumeSchema
>;
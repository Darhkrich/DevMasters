import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  features: z.array(z.string()).optional(),
});
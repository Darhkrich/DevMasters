import { z } from "zod";

export const inquirySchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10),
  serviceCategory: z.string(),
  budgetRange: z.string(),
  timeline: z.string(),
  description: z.string().min(10).max(1000),
  urgency: z.enum(["low", "medium", "high"]),
});
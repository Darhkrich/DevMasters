import { z } from "zod";

export const orderSchema = z.object({
  inquiryId: z.string(),
  price: z.number().min(0),
  timeline: z.string(),
});
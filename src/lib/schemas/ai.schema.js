import { z } from "zod";

export const aiSchema = z.object({
  title: z.string(),
  sector: z.string(),
  features: z.array(z.string()),
});
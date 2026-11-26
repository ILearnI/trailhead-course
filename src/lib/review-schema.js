import { z } from "zod";

export const reviewSchema = z.object({
  trail: z.string(),
  name: z.string().trim().min(2, "Enter your name"),
  rating: z.coerce
    .number({ error: "Rate from 1 to 5" })
    .int("Choose a whole number")
    .min(1, "Rate from 1 to 5")
    .max(5, "Rate from 1 to 5"),
  text: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters")
    .max(400, "Keep it under 400 characters"),
});

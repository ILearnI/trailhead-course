import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  text: z.string().trim().min(5, "Write at least 5 characters").max(200, "Keep it under 200 characters"),
  topic: z.enum(["trails", "weather", "other"]),
  updates: z.boolean(),
  source: z.string(),
});

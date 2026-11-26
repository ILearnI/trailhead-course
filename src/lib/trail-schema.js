import { z } from "zod";
import { slugify } from "@/lib/slugify";

export const trailSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "At least 3 letters")
    .max(60, "At most 60 letters")
    .refine((name) => slugify(name) !== "", "Use letters or digits"),
  region: z.enum(["alps", "coast", "forest"], { error: "Pick a region" }),
  level: z.enum(["Easy", "Moderate", "Hard"], { error: "Pick a level" }),
  km: z.coerce
    .number({ error: "Enter a number" })
    .positive("More than 0 km")
    .max(500, "At most 500 km"),
  description: z.string().trim().max(1000, "At most 1000 letters"),
});

import { z } from "zod";

// What a visitor can ask for, in a sentence
export const searchIntentSchema = z.object({
  region: z.enum(["alps", "coast", "forest"]).nullable().describe("null if not said"),
  level: z.enum(["Easy", "Moderate", "Hard"]).nullable().describe("null if not said"),
  maxKm: z.number().positive().nullable().describe("The longest distance in km, or null"),
});

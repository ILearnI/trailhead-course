import "server-only";
import { google } from "@ai-sdk/google";

// A fast model, with no hidden reasoning
export const MODEL_ID = process.env.AI_MODEL ?? "gemini-3.5-flash-lite";

// The key is read from GOOGLE_GENERATIVE_AI_API_KEY
export function getModel() {
  return google(MODEL_ID);
}

import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

// Hard limits for every call of the model
export const LIMITS = {
  maxMessages: 20,
  maxChars: 500,
  maxOutputTokens: 400,
  timeoutMs: 15_000,
  perMinute: 10,
};

// The body that the chat accepts
export const chatBodySchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.object({ type: z.string() }).passthrough()),
      }),
    )
    .min(1)
    .max(LIMITS.maxMessages),
});

// The last question of the visitor
export function lastQuestion(messages) {
  const last = messages.findLast((message) => message.role === "user");
  return (last?.parts ?? []).map((part) => part.text ?? "").join("");
}

// Who is asking: the first address
export function clientKey(headers) {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

// Ten calls a minute, for each feature
export function aiRateLimit(headers, feature) {
  return rateLimit(`ai:${feature}:${clientKey(headers)}`, {
    limit: LIMITS.perMinute,
    windowMs: 60_000,
  });
}

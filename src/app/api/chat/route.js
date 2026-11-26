import { convertToModelMessages, isStepCount, streamText } from "ai";
import { aiRateLimit, chatBodySchema, lastQuestion, LIMITS } from "@/lib/ai-limits";
import { logUsage } from "@/lib/ai-usage";
import { assistantSystem } from "@/lib/assistant";
import { assistantTools } from "@/lib/assistant-tools";
import { getModel } from "@/lib/ai";

export async function POST(request) {
  const limit = aiRateLimit(request.headers, "chat");
  if (!limit.ok) {
    return Response.json(
      { error: "Too many questions" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // A short, well formed conversation
  const body = chatBodySchema.safeParse(await request.json());
  if (!body.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const { messages } = body.data;
  if (lastQuestion(messages).length > LIMITS.maxChars) {
    return Response.json({ error: "The question is too long" }, { status: 400 });
  }

  const result = streamText({
    model: getModel(),
    system: assistantSystem(),
    tools: assistantTools,
    // Look up, then answer: up to 5 steps
    stopWhen: isStepCount(5),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: LIMITS.maxOutputTokens,
    // Stop if the visitor leaves, or too late
    abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(LIMITS.timeoutMs)]),
    onFinish: ({ totalUsage }) => logUsage("chat", totalUsage),
  });
  // Messages with parts, for the chat hook
  return result.toUIMessageStreamResponse();
}

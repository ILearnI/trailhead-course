import { streamText } from "ai";
import { getTrail } from "@/dal/trails";
import { getModel } from "@/lib/ai";
import { aiRateLimit } from "@/lib/ai-limits";
import { logUsage } from "@/lib/ai-usage";
import { trailPrompt } from "@/lib/trail-prompt";

// Descriptions already written, by trail
const written = new Map();

export async function POST(request) {
  const limit = aiRateLimit(request.headers, "describe");
  if (!limit.ok) {
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const { slug } = await request.json();
  const trail = await getTrail(slug);
  if (!trail) return Response.json({ error: "No such trail" }, { status: 404 });
  // Free: the text is already known
  if (written.has(slug)) return new Response(written.get(slug));

  const result = streamText({
    model: getModel(),
    system:
      "You write short, friendly descriptions of hiking trails. " +
      "Use only the facts that you are given.",
    prompt: trailPrompt(trail),
    maxOutputTokens: 200,
    onFinish: ({ text, totalUsage }) => {
      written.set(slug, text);
      logUsage("describe", totalUsage);
    },
  });
  // The text, as it is written
  return result.toTextStreamResponse();
}

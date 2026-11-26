import "server-only";
import { generateText, Output } from "ai";
import { getModel } from "@/lib/ai";
import { LIMITS } from "@/lib/ai-limits";
import { logUsage } from "@/lib/ai-usage";
import { searchIntentSchema } from "@/lib/search-intent";

// A sentence in, filters out: validated
export async function parseSearch(sentence) {
  const { output, usage } = await generateText({
    model: getModel(),
    output: Output.object({ schema: searchIntentSchema }),
    system: "Turn the visitor's sentence into trail filters. Use null for what is not said.",
    prompt: sentence,
    maxOutputTokens: 100,
    abortSignal: AbortSignal.timeout(LIMITS.timeoutMs),
  });
  logUsage("search", usage);
  return output;
}

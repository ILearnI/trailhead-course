"use server";

import { headers } from "next/headers";
import { listTrails } from "@/dal/trails";
import { aiRateLimit } from "@/lib/ai-limits";
import { filterTrails } from "@/lib/filter-trails";
import { parseSearch } from "@/lib/search-ai";

const MAX_LENGTH = 200;

export async function findByWords(prevState, formData) {
  const sentence = String(formData.get("sentence") ?? "").trim();
  if (!sentence) return { sentence, error: "Describe the trail that you want." };
  if (sentence.length > MAX_LENGTH) {
    return { sentence, error: `Keep it under ${MAX_LENGTH} characters.` };
  }
  const limit = aiRateLimit(await headers(), "find");
  if (!limit.ok) {
    return { sentence, error: `Too many searches. Try again in ${limit.retryAfter} s.` };
  }
  try {
    const intent = await parseSearch(sentence);
    const trails = filterTrails(await listTrails(), intent);
    return { sentence, intent, trails };
  } catch {
    return { sentence, error: "The search is not available. Try again." };
  }
}

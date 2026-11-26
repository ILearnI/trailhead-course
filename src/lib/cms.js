import "server-only";
import { readFile } from "node:fs/promises";
import { cacheLife } from "next/cache";
import { draftMode } from "next/headers";

// A tiny CMS: published and draft texts
export async function getEntry(key) {
  "use cache";
  cacheLife("hours");
  const { isEnabled } = await draftMode();
  const file = await readFile("content/news.json", "utf8");
  const entry = JSON.parse(file)[key];
  return { text: isEnabled ? entry.draft : entry.published, draft: isEnabled };
}

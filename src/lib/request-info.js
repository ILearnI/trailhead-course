import { headers } from "next/headers";

// Anywhere in a request: no need to pass it down
export async function preferredLanguage() {
  const header = (await headers()).get("accept-language") ?? "en";
  return header.split(",")[0].trim();
}

import { connection } from "next/server";
import { countReviews } from "@/dal/review-count";

export async function GET() {
  // Wait for a request: never at build time
  await connection();
  const reviews = await countReviews();
  return Response.json({ reviews }, { headers: { "Cache-Control": "no-store" } });
}

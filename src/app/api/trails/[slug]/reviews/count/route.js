import { connection } from "next/server";
import { countReviewsFor } from "@/dal/review-count";

export async function GET(request, { params }) {
  // Wait for a request: never at build time
  await connection();
  const { slug } = await params;
  const reviews = await countReviewsFor(slug);
  return Response.json({ reviews }, { headers: { "Cache-Control": "no-store" } });
}

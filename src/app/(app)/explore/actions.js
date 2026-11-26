"use server";

import { updateTag } from "next/cache";
import { verifySession } from "@/dal/auth";
import { createReview } from "@/dal/reviews";
import { tags } from "@/lib/tags";

export async function postReview(formData) {
  // Only a signed in person can write a review
  const { userId } = await verifySession();
  const slug = String(formData.get("slug"));
  const rating = Number(formData.get("rating"));
  const text = String(formData.get("text") ?? "").trim();
  // The same rules as the review schema
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return;
  if (text.length < 10 || text.length > 400) return;
  const saved = await createReview({ slug, rating, text, userId });
  if (!saved) return;
  // Expire what depends on the reviews
  updateTag(tags.reviews(slug));
  updateTag(tags.ranking);
}

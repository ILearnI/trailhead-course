"use server";

import { updateTag } from "next/cache";
import { deleteReview } from "@/dal/moderation";
import { tags } from "@/lib/tags";

export async function removeReview(formData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;
  const result = await deleteReview(id);
  if (!result.ok) return;
  updateTag(tags.reviews(result.slug));
  updateTag(tags.ranking);
}

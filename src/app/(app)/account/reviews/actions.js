"use server";

import { updateTag } from "next/cache";
import { deleteMyReview } from "@/dal/my-reviews";
import { tags } from "@/lib/tags";

export async function removeMyReview(formData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;
  const slug = await deleteMyReview(id);
  if (!slug) return;
  updateTag(tags.reviews(slug));
  updateTag(tags.ranking);
}

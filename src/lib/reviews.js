import { reviews } from "@/data/reviews";

export async function getReviews(slug) {
  return reviews.filter((review) => review.trail === slug);
}

import { cacheLife, cacheTag } from "next/cache";
import ReviewBoard from "@/components/ReviewBoard";
import { fetchReviews } from "@/lib/api";

export default async function ReviewSection({ slug }) {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews");

  const reviews = await fetchReviews(slug);
  return <ReviewBoard slug={slug} reviews={reviews} />;
}

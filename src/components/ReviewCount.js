import { getReviews } from "@/lib/reviews";

export default async function ReviewCount({ slug }) {
  const items = await getReviews(slug);

  return <p className="mt-2 text-sm text-zinc-500">{items.length} reviews</p>;
}

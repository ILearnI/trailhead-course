import { getReviews } from "@/lib/reviews";

export default async function ReviewPreview({ slug }) {
  const items = await getReviews(slug);

  if (items.length === 0) return <p className="text-sm">No reviews yet.</p>;

  return (
    <ul className="space-y-1 text-sm">
      {items.map((review) => (
        <li key={review.text}>{`Latest review: ${review.rating}/5, ${review.text}`}</li>
      ))}
    </ul>
  );
}

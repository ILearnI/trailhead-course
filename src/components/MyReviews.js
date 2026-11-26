import { listMyReviews } from "@/dal/my-reviews";
import { removeMyReview } from "@/app/(app)/account/reviews/actions";

export default async function MyReviews() {
  const items = await listMyReviews();
  if (items.length === 0) return <p className="mt-4">You have no reviews.</p>;

  return (
    <ul className="mt-4 space-y-3">
      {items.map((review) => (
        <li key={review.id}>
          {`${review.trail}: ${review.rating}/5, ${review.text}`}
          <form action={removeMyReview} className="inline">
            <input type="hidden" name="id" value={review.id} />
            <button type="submit" className="ml-3 text-sm underline">Remove</button>
          </form>
        </li>
      ))}
    </ul>
  );
}

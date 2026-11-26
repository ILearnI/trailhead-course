import { removeReview } from "@/app/(app)/studio/reviews/actions";
import { listRecentReviews } from "@/dal/moderation";

export const metadata = { title: "Studio: reviews" };

export default async function StudioReviews() {
  const items = await listRecentReviews();
  return (
    <section>
      <h1 className="text-3xl font-semibold">Reviews</h1>
      <ul className="mt-4 space-y-4">
        {items.map((review) => (
          <li key={review.id} className="rounded-xl border p-4">
            <p className="text-sm text-zinc-500">
              {`${review.trail}, by ${review.author ?? "Anonymous"}, ${review.rating}/5`}
            </p>
            <p className="mt-1">{review.text}</p>
            <form action={removeReview} className="mt-2">
              <input type="hidden" name="id" value={review.id} />
              <button
                type="submit"
                aria-label={`Remove: ${review.text}`}
                className="underline"
              >
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}

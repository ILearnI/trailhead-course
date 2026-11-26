import { notFound } from "next/navigation";
import { getTrail, listTrails } from "@/dal/trails";
import { listReviews } from "@/dal/reviews";
import { postReview } from "../actions";

export async function generateStaticParams() {
  const items = await listTrails();
  return items.map((trail) => ({ slug: trail.slug }));
}

export default async function ExploreTrailPage({ params }) {
  const { slug } = await params;
  const trail = await getTrail(slug);
  if (!trail) notFound();
  const items = await listReviews(slug);

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">{trail.name}</h1>
      <p className="mt-2 text-muted">{trail.description}</p>
      <h2 className="mt-6 font-semibold">Reviews</h2>
      {items.length === 0 && <p className="mt-2 text-sm">No reviews yet.</p>}
      <ul className="mt-2 space-y-2">
        {items.map((review) => (
          <li key={review.id}>{`${review.author}: ${review.rating}/5, ${review.text}`}</li>
        ))}
      </ul>
      <form
        action={postReview}
        id="explore-review-form"
        className="mt-6 space-y-2"
      >
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          placeholder="Rating, 1 to 5"
          className="block rounded-lg border bg-surface px-3 py-2"
        />
        <textarea
          name="text"
          placeholder="Your review"
          className="block w-full rounded-lg border bg-surface px-3 py-2"
        />
        <input type="hidden" name="slug" value={slug} />
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
          Add review
        </button>
      </form>
    </main>
  );
}

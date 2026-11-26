import { reviews } from "@/data/reviews";

export default function ActivityPanel() {
  return (
    <div>
      <h2 className="font-semibold">Recent reviews</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {reviews.map((review) => (
          <li key={review.text}>
            {review.trail}: {review.rating}/5
          </li>
        ))}
      </ul>
    </div>
  );
}

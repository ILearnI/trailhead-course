import reviews from "./all-reviews.json";

// Three are shown, but all are imported
export default function TopReviews() {
  const best = reviews.filter((review) => review.rating === 5).slice(0, 3);

  return (
    <ul className="mt-6 list-disc pl-6">
      {best.map((review) => (
        <li key={review.id}>{review.text}</li>
      ))}
    </ul>
  );
}

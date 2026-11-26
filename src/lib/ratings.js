// The ratings of a trail, from its reviews
export function summarize(reviews) {
  const count = reviews.length;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = count === 0 ? null : Math.round((total / count) * 10) / 10;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const { rating } of reviews) distribution[rating] += 1;
  return { count, average, distribution };
}

export function describeRating({ count, average }) {
  if (count === 0) return "No reviews yet";
  const reviews = count === 1 ? "1 review" : `${count} reviews`;
  return `Rated ${average} out of 5, from ${reviews}`;
}

// The label of a line of the summary
export function starLabel(stars) {
  return stars === 1 ? "1 star" : `${stars} stars`;
}

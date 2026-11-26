"use client";

import { useState } from "react";

export default function RatingStars() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="mt-4">
      <p className="text-sm">Rate this trail</p>
      <div className="flex gap-1 text-2xl" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            aria-label={`${value} stars`}
          >
            {value <= (hover || rating) ? "★" : "☆"}
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm text-zinc-500">{`You rated ${rating} out of 5`}</p>
      )}
    </div>
  );
}

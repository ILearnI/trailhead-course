"use client";

import { useOptimistic, useState } from "react";
import { likeTrail } from "@/app/actions";

export default function LikeButton({ slug, count }) {
  const [error, setError] = useState("");
  const [shown, addLike] = useOptimistic(count, (current, amount) => current + amount);

  async function like() {
    setError("");
    addLike(1);
    const result = await likeTrail(slug);
    if (!result.ok) setError("Could not like");
  }

  return (
    <form action={like} className="flex items-center gap-2">
      <button type="submit" aria-label={`Like ${slug}`} className="text-xl">
        ♥
      </button>
      <span>{shown}</span>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}

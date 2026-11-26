"use client";

import { useFavorites } from "./FavoritesProvider";

export default function FavoriteButton({ slug, name }) {
  const { saved: list, toggle } = useFavorites();
  const saved = list.includes(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      aria-pressed={saved}
      aria-label={`Save ${name}`}
      className="text-xl"
    >
      {saved ? "★" : "☆"}
    </button>
  );
}

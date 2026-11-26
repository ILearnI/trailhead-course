"use client";

import { useFavorites } from "./FavoritesProvider";

export default function FavoritesCount() {
  const { saved } = useFavorites();

  return <span className="ml-auto">{`★ ${saved.length} saved`}</span>;
}

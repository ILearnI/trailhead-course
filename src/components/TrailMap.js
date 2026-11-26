"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// The size of the map, for each of its states
const BOX = "mt-4 flex h-80 w-full items-center justify-center rounded-xl border";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => <div className={`${BOX} text-sm`}>Loading the map...</div>,
});

export default function TrailMap({ points }) {
  const [shown, setShown] = useState(false);

  if (shown) return <MapCanvas points={points} />;
  return (
    <button
      onClick={() => setShown(true)}
      onMouseEnter={() => import("./MapCanvas")}
      onFocus={() => import("./MapCanvas")}
      className={BOX}
    >
      Show the map
    </button>
  );
}

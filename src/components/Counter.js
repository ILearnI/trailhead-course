"use client";

import { useState } from "react";

export default function Counter({ label = "Saved trails" }) {
  const [count, setCount] = useState(0);

  return (
    <button
      className="rounded-full bg-emerald-700 px-5 py-2 text-white"
      onClick={() => setCount(count + 1)}
    >
      {label}: {count}
    </button>
  );
}

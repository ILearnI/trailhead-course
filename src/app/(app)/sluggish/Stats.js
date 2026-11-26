"use client";

import { useState } from "react";

// A slow calculation, for the exercise
function heavy() {
  let total = 0;
  const end = performance.now() + 400;
  while (performance.now() < end) total += Math.sqrt(total + 1);
  return Math.round(total);
}

export default function Stats() {
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);

  function recalculate() {
    setBusy(true);
    // Paint "Working..." first, then do the work
    setTimeout(() => {
      setScore(heavy());
      setBusy(false);
    }, 0);
  }

  return (
    <section className="mt-6">
      <p>Trail score: {busy ? "Working..." : score}</p>
      <button
        onClick={recalculate}
        className="mt-2 rounded-lg bg-brand-700 px-4 py-2 text-white"
      >
        Recalculate
      </button>
    </section>
  );
}

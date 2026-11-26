"use client";

import { useEffect, useRef } from "react";

export default function VisitedAt() {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.textContent = `Opened at ${new Date().toLocaleTimeString()}`;
  }, []);

  return (
    <p ref={ref} className="mt-2 text-sm text-zinc-500">
      Opened at -
    </p>
  );
}

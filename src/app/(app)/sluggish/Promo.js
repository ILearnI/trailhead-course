"use client";

import { useEffect, useState } from "react";

// A banner that arrives late, above the content
export default function Promo() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShown(true), 600);
    return () => clearTimeout(id);
  }, []);

  // The space is reserved, so nothing moves
  return (
    <div className="mb-6 h-96">
      {shown && (
        <aside className="flex h-full items-center rounded-lg bg-brand-100 px-6 text-black">
          Free guide: ten trails for the first snow.
        </aside>
      )}
    </div>
  );
}

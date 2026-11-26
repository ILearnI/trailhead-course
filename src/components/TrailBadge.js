"use client";

import { useState } from "react";

export default function TrailBadge({ name, region }) {
  const [shown, setShown] = useState(false);

  return (
    <button onClick={() => setShown(!shown)} className="mt-2 text-sm underline">
      {shown ? region : `About ${name}`}
    </button>
  );
}

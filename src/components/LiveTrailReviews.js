"use client";

import { useEffect, useState } from "react";

export default function LiveTrailReviews({ slug }) {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const source = new EventSource(`/api/trails/${slug}/events`);
    source.addEventListener("count", (event) => {
      setTotal(JSON.parse(event.data).reviews);
    });
    return () => source.close();
  }, [slug]);

  if (total === null) return <p className="mt-2 text-sm">Counting...</p>;
  return <p className="mt-2 text-sm">{`Live: ${total} reviews`}</p>;
}

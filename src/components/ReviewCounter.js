"use client";

import { useEffect, useState } from "react";

export default function ReviewCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const source = new EventSource("/api/events");
    source.addEventListener("count", (event) => {
      setCount(JSON.parse(event.data).reviews);
    });
    // Close the connection when the page goes away
    return () => source.close();
  }, []);

  return (
    <p className="mt-4 text-xl">
      {count === null ? "Connecting..." : `${count} reviews so far`}
    </p>
  );
}

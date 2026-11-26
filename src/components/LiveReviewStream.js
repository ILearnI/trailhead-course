"use client";

import { useEffect, useState } from "react";

export default function LiveReviewStream() {
  const [total, setTotal] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // One connection, kept open by the browser
    const source = new EventSource("/api/events");
    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.addEventListener("count", (event) => {
      setTotal(JSON.parse(event.data).reviews);
    });
    return () => source.close();
  }, []);

  if (total === null) return <p>Connecting...</p>;
  return (
    <p>
      {`Live from the stream: ${total}`}
      <span className="ml-2 text-sm text-zinc-500">
        {connected ? "connected" : "reconnecting"}
      </span>
    </p>
  );
}

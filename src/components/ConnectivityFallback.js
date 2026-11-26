"use client";

import { useOffline } from "next/offline";

export default function ConnectivityFallback() {
  const offline = useOffline();

  return <p>{offline ? "Waiting for the connection..." : "Loading..."}</p>;
}

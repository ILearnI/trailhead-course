"use client";

import { useOffline } from "next/offline";

export default function OfflineBanner() {
  const offline = useOffline();
  if (!offline) return null;

  return (
    <p role="status" className="bg-amber-100 px-4 py-2 text-sm text-amber-950">
      You are offline. We will try again when the connection returns.
    </p>
  );
}

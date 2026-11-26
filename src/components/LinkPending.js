"use client";

import { useLinkStatus } from "next/link";

export default function LinkPending() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={`ml-2 inline-block size-3 rounded-full border-2 border-emerald-600 border-t-transparent ${
        pending ? "animate-spin opacity-100" : "opacity-0"
      }`}
    />
  );
}

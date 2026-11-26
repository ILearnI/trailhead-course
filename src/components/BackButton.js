"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="ml-4 text-sm underline">
      Back
    </button>
  );
}

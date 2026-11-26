"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ children }) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") router.back();
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => router.back()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="rounded-2xl bg-white p-6 text-black"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
        <button onClick={() => router.back()} className="mt-4 text-sm underline">
          Close
        </button>
      </div>
    </div>
  );
}

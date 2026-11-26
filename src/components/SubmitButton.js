"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }) {
  // The status of the parent form
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
    >
      {pending ? "Sending..." : children}
    </button>
  );
}

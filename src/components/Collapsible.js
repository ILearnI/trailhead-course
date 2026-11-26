"use client";

import { useState } from "react";

export default function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-6 rounded-xl border p-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="font-semibold"
      >
        {open ? "Hide" : "Show"} {title}
      </button>
      {open && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </section>
  );
}

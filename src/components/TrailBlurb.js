"use client";

import { useState } from "react";

export default function TrailBlurb({ slug }) {
  const [text, setText] = useState("");
  const [state, setState] = useState("idle");

  async function describe() {
    setText("");
    setState("streaming");
    try {
      const response = await fetch("/api/describe", {
        method: "POST",
        body: JSON.stringify({ slug }),
      });
      if (!response.ok) throw new Error("The request failed");
      // Read the answer piece by piece
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((current) => current + value);
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section aria-label="Description" className="mt-4">
      <button
        onClick={describe}
        disabled={state === "streaming"}
        className="rounded-lg border px-4 py-2 disabled:opacity-60"
      >
        {state === "streaming" ? "Writing..." : "Describe this trail"}
      </button>
      {text && <p className="mt-2">{text}</p>}
      {state === "error" && <p role="alert">The description could not be written.</p>}
    </section>
  );
}

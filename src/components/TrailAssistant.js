"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

// What the assistant looks at, for each tool
const LOOKING = {
  "tool-findTrails": "the list of trails",
  "tool-getTrailDetails": "the details of a trail",
  "tool-compareTrails": "a comparison of trails",
};

export default function TrailAssistant() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";

  function submit(event) {
    event.preventDefault();
    if (!input.trim() || busy) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <section aria-label="Assistant" className="mt-6">
      <ul aria-live="polite" className="space-y-3">
        {messages.map((message) => (
          <li key={message.id} className={message.role === "user" ? "text-right" : ""}>
            <span className="text-xs text-zinc-500">
              {message.role === "user" ? "You" : "Assistant"}
            </span>
            {message.parts.map((part, index) => {
              if (part.type === "text") return <p key={index}>{part.text}</p>;
              if (!(part.type in LOOKING)) return null;
              const done = part.state === "output-available";
              const what = LOOKING[part.type];
              return (
                <p key={part.toolCallId} className="text-xs text-zinc-500">
                  {done ? `Looked at ${what}` : `Looking at ${what}...`}
                </p>
              );
            })}
          </li>
        ))}
        {status === "submitted" && <li className="text-zinc-500">Thinking...</li>}
      </ul>
      {error && <p role="alert">Something went wrong. Try again.</p>}
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <label htmlFor="ask" className="sr-only">Your question</label>
        <input
          id="ask"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-lg border bg-surface px-3 py-2"
        />
        {busy ? (
          <button type="button" onClick={stop} className="rounded-lg border px-4 py-2">
            Stop
          </button>
        ) : (
          <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
            Ask
          </button>
        )}
      </form>
    </section>
  );
}

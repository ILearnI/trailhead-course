"use client";

import { useEffect, useRef, useState } from "react";

const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL ?? "ws://localhost:4003";

export default function TrailChat() {
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [people, setPeople] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const ws = new WebSocket(CHAT_URL);
    socket.current = ws;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "users") setPeople(data.count);
      else setMessages((list) => [...list, data]);
    };
    return () => ws.close();
  }, []);

  function send(event) {
    event.preventDefault();
    const ws = socket.current;
    if (!text.trim() || ws?.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "message", name: "A hiker", text }));
    setText("");
  }

  return (
    <section aria-label="Trail chat" className="mt-6">
      <h2 className="text-xl font-semibold">Trail chat</h2>
      <p className="text-sm text-zinc-600">{`${people} here`}</p>
      <ul className="mt-2 space-y-1">
        {messages.map((message, index) => (
          <li key={index}>{`${message.name}: ${message.text}`}</li>
        ))}
      </ul>
      <form onSubmit={send} className="mt-2 flex gap-2">
        <label htmlFor="chat-text" className="sr-only">Message</label>
        <input
          id="chat-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="rounded-lg border bg-surface px-3 py-2"
        />
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
          Send
        </button>
      </form>
    </section>
  );
}

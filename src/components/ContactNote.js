"use client";

import { useActionState } from "react";
import { greet } from "@/app/actions";

export default function ContactNote() {
  const [note, action] = useActionState(greet, "");

  return (
    <form action={action} id="note-form" className="mt-6 flex items-center gap-2">
      <label htmlFor="note-name" className="sr-only">Your name</label>
      <input id="note-name" name="name" placeholder="Your name" className="rounded-lg border bg-surface px-3 py-2" />
      <button type="submit" className="rounded-lg border px-4 py-2">
        Say hello
      </button>
      {note && <span>{note}</span>}
    </form>
  );
}

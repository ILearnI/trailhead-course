"use client";

import { useActionState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { sendMessage } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

const initialState = { errors: {}, values: {} };

export default function MessageForm() {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);
  const toast = useToast();

  useEffect(() => {
    if (state.sent) toast("Message sent");
    else if (Object.keys(state.errors).length > 0) toast("Please check the form", "error");
  }, [state, toast]);

  return (
    <form action={formAction} id="message-form" aria-busy={pending} className="mt-6 space-y-2 aria-busy:opacity-60">
      <label htmlFor="msg-name" className="block text-sm">Your name</label>
      <input id="msg-name" name="name" defaultValue={state.values?.name} placeholder="Your name" className="block rounded-lg border bg-surface px-3 py-2" />
      {state.errors.name && <p className="text-sm text-red-600">{state.errors.name[0]}</p>}
      <label htmlFor="msg-text" className="block text-sm">Your message</label>
      <textarea id="msg-text" name="text" defaultValue={state.values?.text} placeholder="Your message" className="block w-full rounded-lg border bg-surface px-3 py-2" />
      {state.errors.text && <p className="text-sm text-red-600">{state.errors.text[0]}</p>}
      <label htmlFor="msg-topic" className="block text-sm">Topic</label>
      <select id="msg-topic" name="topic" className="block rounded-lg border bg-surface px-3 py-2">
        <option value="trails">Trails</option>
        <option value="weather">Weather</option>
        <option value="other">Other</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="updates" /> Send me news
      </label>
      <input type="hidden" name="source" value="contact-page" />
      <SubmitButton>Send</SubmitButton>
      {state.sent && <p className="text-sm text-emerald-700">Message sent.</p>}
    </form>
  );
}

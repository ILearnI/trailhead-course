"use client";

import { useActionState } from "react";
import { login } from "@/app/(app)/login/actions";

const FIELD = "block w-full rounded-lg border bg-surface px-3 py-2";

export default function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction} id="login-form" className="mt-6 space-y-3">
      <input type="hidden" name="next" value={next ?? ""} />
      <label htmlFor="login-email" className="block text-sm">
        Email
      </label>
      <input
        name="email"
        type="email"
        autoComplete="username"
        defaultValue={state.email}
        id="login-email"
        className={FIELD}
      />
      <label htmlFor="login-password" className="block text-sm">
        Password
      </label>
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        id="login-password"
        className={FIELD}
      />
      {state.error && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Checking..." : "Log in"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { signUp } from "@/app/(app)/signup/actions";

const initialState = { errors: {}, values: {} };
const FIELD = "block w-full rounded-lg border bg-surface px-3 py-2";

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} id="signup-form" className="mt-6 space-y-3">
      <input
        name="name"
        defaultValue={state.values?.name}
        placeholder="Your name"
        className={FIELD}
      />
      {state.errors.name && (
        <p className="text-sm text-red-600">{state.errors.name[0]}</p>
      )}
      <input
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        placeholder="Email"
        className={FIELD}
      />
      {state.errors.email && (
        <p className="text-sm text-red-600">{state.errors.email[0]}</p>
      )}
      <input
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Password, 8 characters or more"
        className={FIELD}
      />
      {state.errors.password && (
        <p className="text-sm text-red-600">{state.errors.password[0]}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}

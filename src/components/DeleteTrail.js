"use client";

import { useActionState } from "react";
import { removeTrail } from "@/app/(app)/studio/trails/actions";

export default function DeleteTrail({ slug }) {
  const [state, action, pending] = useActionState(removeTrail, {});
  return (
    <form action={action} className="mt-10 max-w-md space-y-3 border-t pt-6">
      <input type="hidden" name="slug" value={slug} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="confirm" value="yes" />
        Yes, delete this trail and its reviews
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-lg border px-4 py-2">
        Delete trail
      </button>
    </form>
  );
}

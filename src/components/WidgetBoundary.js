"use client";

import { catchError } from "next/error";

function Fallback(props, { error, retry }) {
  return (
    <div className="mt-4 rounded-xl border p-4">
      <p>{`${props.title} could not load.`}</p>
      <button onClick={() => retry()} className="mt-2 underline">
        Try again
      </button>
    </div>
  );
}

export default catchError(Fallback);

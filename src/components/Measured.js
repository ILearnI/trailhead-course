"use client";

import { Profiler } from "react";

// Records every commit of the tree inside it
export default function Measured({ id, children }) {
  const record = (name, phase, actualDuration) => {
    window.commits ??= [];
    window.commits.push({ name, phase, ms: actualDuration });
  };

  return (
    <Profiler id={id} onRender={record}>
      {children}
    </Profiler>
  );
}

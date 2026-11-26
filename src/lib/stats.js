import { io } from "next/cache";

import { cache } from "react";

// A stand-in for a database: it counts its reads
let reads = 0;

// Same slug, same render: one read
export const getStats = cache(async (slug) => {
  // Real input and output: not for the shell
  await io();
  reads += 1;
  // A slow read
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { slug, reads };
});

// Start the request early, do not wait
export function preloadStats(slug) {
  void getStats(slug);
}

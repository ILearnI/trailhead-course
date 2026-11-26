"use server";

import { refresh, revalidateTag, updateTag } from "next/cache";

// Immediate: the next read waits for fresh data
export async function endNow() {
  updateTag("lab:a");
}

// Gentle: old data now, a new one starts
export async function endLater() {
  revalidateTag("lab:a", "max");
}

// Only the router: dynamic parts are read again
export async function refreshNow() {
  refresh();
}

// Ends the tag of the second page
export async function endNav() {
  updateTag("nav");
}

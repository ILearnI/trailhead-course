"use server";

import { updateTag } from "next/cache";

// Called when an editor publishes a new price
export async function publishPrice() {
  updateTag("price");
}

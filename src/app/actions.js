"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "node:fs/promises";
import { EXTENSIONS, checkPhoto } from "@/lib/upload";
import { redirect } from "next/navigation";
import { z } from "zod";
import { messageSchema } from "@/lib/message-schema";
import { trails } from "@/data/trails";
import { reviewSchema } from "@/lib/review-schema";

const API = "http://localhost:4002";

export async function sendMessage(prevState, formData) {
  const input = {
    name: formData.get("name"),
    text: formData.get("text"),
    topic: formData.get("topic"),
    source: formData.get("source"),
    // An unchecked box sends nothing
    updates: formData.get("updates") === "on",
  };
  const parsed = messageSchema.safeParse(input);

  // Stop here when the input is not valid
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      // Give back what the visitor typed
      values: { name: input.name, text: input.text },
    };
  }

  await fetch(`${API}/messages?delay=1500`, { method: "POST", body: JSON.stringify(parsed.data) });
  // Refresh the data shown on the contact page
  revalidatePath("/contact");
  return { errors: {}, values: {}, sent: true };
}

export async function likeTrail(slug) {
  const response = await fetch(`${API}/likes?slug=${slug}&delay=1500`, { method: "POST" });
  if (!response.ok) return { ok: false };
  updateTag("likes");
  return { ok: true };
}

export async function suggestTrail(formData) {
  const name = String(formData.get("name") ?? "").trim();
  const photo = formData.get("photo");
  const problem = checkPhoto(photo);
  if (problem) redirect(`/suggest?error=${problem}`);
  const response = await fetch(`${API}/suggestions`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const suggestion = await response.json();
  // Our own file name: never trust the visitor's
  const file = `${suggestion.id}.${EXTENSIONS[photo.type]}`;
  await mkdir("uploads", { recursive: true });
  await writeFile(`uploads/${file}`, Buffer.from(await photo.arrayBuffer()));
  redirect(`/suggestions/${suggestion.id}`);
}

export async function greet(prevState, formData) {
  return `Thanks, ${formData.get("name")}!`;
}

export async function closeTrail(formData) {
  const slug = formData.get("slug");
  // Who is calling? Ask the server, not the form
  const token = (await cookies()).get("ranger-token")?.value;
  if (!token || token !== process.env.RANGER_TOKEN) return;
  if (!trails.some((trail) => trail.slug === slug)) return;
  await fetch(`${API}/closures`, { method: "POST", body: JSON.stringify({ slug }) });
  revalidatePath("/rangers");
}

export async function addReview(prevState, formData) {
  const input = {
    trail: formData.get("trail"),
    name: formData.get("name"),
    rating: formData.get("rating"),
    text: formData.get("text"),
  };
  const parsed = reviewSchema.safeParse(input);
  // Back to the form, with the errors
  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return { errors, values: input };
  }
  const known = trails.some((t) => t.slug === parsed.data.trail);
  if (!known) return { errors: {}, values: input, failed: true };
  const response = await fetch(`${API}/reviews?delay=1200`, {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!response.ok) return { errors: {}, values: input, failed: true };
  updateTag("reviews");
  return { errors: {}, values: {}, ok: true };
}

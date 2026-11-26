"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createTrail, deleteTrail, updateTrail } from "@/dal/trail-writes";
import { removePhoto, savePhoto } from "@/lib/photo-store";
import { tags } from "@/lib/tags";
import { trailSchema } from "@/lib/trail-schema";

const FIELDS = ["name", "region", "level", "km", "description"];

// Only the fields of the form, as text
function valuesOf(formData) {
  return Object.fromEntries(FIELDS.map((name) => [name, String(formData.get(name) ?? "")]));
}

// What a write changes: pages must refresh
function refresh(slug) {
  updateTag(tags.trails);
  updateTag(tags.trail(slug));
  updateTag(tags.ranking);
}

export async function saveTrail(previous, formData) {
  const values = valuesOf(formData);
  const parsed = trailSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }
  let data = parsed.data;
  const upload = formData.get("photo");
  if (upload instanceof File && upload.size > 0) {
    const saved = await savePhoto(upload);
    if (!saved.ok) return { errors: { photo: [saved.error] }, values };
    data = { ...data, photo: saved.name };
  }
  const slug = String(formData.get("slug") ?? "");
  const result = slug ? await updateTrail(slug, data) : await createTrail(data);
  if (!result.ok) {
    // The write failed: do not keep the new file
    await removePhoto(data.photo);
    return { errors: { name: [result.error] }, values };
  }
  // The old photo is not used any more
  await removePhoto(result.replaced);
  refresh(result.slug);
  redirect("/studio/trails");
}

export async function removeTrail(previous, formData) {
  const slug = String(formData.get("slug") ?? "");
  if (formData.get("confirm") !== "yes") {
    return { error: "Tick the box to confirm" };
  }
  const result = await deleteTrail(slug);
  if (!result.ok) return { error: "No such trail" };
  await removePhoto(result.photo);
  refresh(slug);
  redirect("/studio/trails");
}

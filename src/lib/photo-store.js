import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { photoProblem, sniffImage } from "@/lib/photo";

const folder = () => process.env.UPLOAD_DIR ?? "data/uploads";
// The names that we make
const NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

// Where a photo lives
function fileOf(name) {
  return path.join(
    /*turbopackIgnore: true*/ folder(),
    name,
  );
}

// Save an upload under a name that we choose
export async function savePhoto(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const problem = photoProblem(bytes);
  if (problem) return { ok: false, error: problem };
  const name = `${randomUUID()}.${sniffImage(bytes)}`;
  await mkdir(folder(), { recursive: true });
  await writeFile(fileOf(name), bytes);
  return { ok: true, name };
}

// Only the names that we made can be read
export async function readPhoto(name) {
  if (!NAME.test(name)) return null;
  try {
    return await readFile(fileOf(name));
  } catch {
    return null;
  }
}

export async function removePhoto(name) {
  if (!name || !NAME.test(name)) return;
  await rm(fileOf(name), { force: true });
}

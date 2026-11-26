// The most that we accept: 2 MB
export const MAX_BYTES = 2 * 1024 * 1024;

// The type of an image, from its first bytes
export function sniffImage(bytes) {
  const start = Array.from(bytes.subarray(0, 12));
  const text = (from, to) => String.fromCharCode(...start.slice(from, to));
  if (start[0] === 0xff && start[1] === 0xd8 && start[2] === 0xff) return "jpg";
  if (text(1, 4) === "PNG") return "png";
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return "webp";
  return null;
}

// What is wrong with this upload, or null
export function photoProblem(bytes) {
  if (bytes.length > MAX_BYTES) return "At most 2 MB";
  if (!sniffImage(bytes)) return "Choose a JPEG, PNG or WebP image";
  return null;
}

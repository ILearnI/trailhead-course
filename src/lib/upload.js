// The rules of a photo upload
export const MAX_SIZE = 2 * 1024 * 1024;
export const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// The name of the problem, or null
export function checkPhoto(file) {
  if (!(file instanceof File) || file.size === 0) return "missing";
  if (!(file.type in EXTENSIONS)) return "type";
  if (file.size > MAX_SIZE) return "size";
  return null;
}

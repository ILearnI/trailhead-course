import { readPhoto } from "@/lib/photo-store";

const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(request, { params }) {
  const { name } = await params;
  const bytes = await readPhoto(name);
  if (!bytes) return new Response("Not found", { status: 404 });
  return new Response(bytes, {
    headers: {
      "Content-Type": TYPES[name.split(".").pop()],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

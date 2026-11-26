import { revalidateTag } from "next/cache";

export async function POST(request) {
  // Only our own tools know the secret
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tag = new URL(request.url).searchParams.get("tag");
  if (!tag) return Response.json({ error: "Missing tag" }, { status: 400 });
  revalidateTag(tag, "max");
  return Response.json({ revalidated: tag });
}

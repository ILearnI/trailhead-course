import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createReview, listReviews } from "@/dal/reviews";
import { getTrail } from "@/dal/trails";
import { getSession } from "@/lib/session";
import { tags } from "@/lib/tags";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(400),
});

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!(await getTrail(slug))) {
    return Response.json({ error: "No such trail" }, { status: 404 });
  }
  const items = await listReviews(slug);
  return Response.json({ count: items.length, items });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The body must be JSON" }, { status: 400 });
  }
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return Response.json({ errors }, { status: 400 });
  }
  const saved = await createReview({ slug, ...parsed.data, userId: session.userId });
  if (!saved) return Response.json({ error: "No such trail" }, { status: 404 });
  revalidateTag(tags.reviews(slug), "max");
  revalidateTag(tags.ranking, "max");
  return Response.json({ id: saved.id }, { status: 201 });
}

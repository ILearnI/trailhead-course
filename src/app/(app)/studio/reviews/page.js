import { requirePermission } from "@/dal/auth";

export const metadata = { title: "Studio: reviews" };

export default async function StudioReviews() {
  await requirePermission("review:delete:any");
  return (
    <section>
      <h1 className="text-3xl font-semibold">Reviews</h1>
      <p className="mt-2">Moderation comes in part two.</p>
    </section>
  );
}

import { cacheLife, cacheTag } from "next/cache";
import { trails } from "@/data/trails";
import LikeButton from "@/components/LikeButton";

export default async function LikesList() {
  "use cache";
  cacheLife("hours");
  cacheTag("likes");

  const response = await fetch("http://localhost:4002/likes");
  const likes = await response.json();

  return (
    <ul className="mt-4 space-y-2">
      {trails.map((trail) => (
        <li key={trail.slug} className="flex items-center justify-between rounded-xl border p-3">
          <span>{trail.name}</span>
          <LikeButton slug={trail.slug} count={likes[trail.slug] ?? 0} />
        </li>
      ))}
    </ul>
  );
}

import { Suspense } from "react";
import LikesList from "@/components/LikesList";

export default function LikesPage() {
  return (
    <main className="mx-auto max-w-xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Likes</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <LikesList />
      </Suspense>
    </main>
  );
}

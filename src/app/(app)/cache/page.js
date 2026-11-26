import { Suspense } from "react";
import CachedCount from "@/components/CachedCount";
import LiveCount from "@/components/LiveCount";

export default function CachePage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Cache</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <ul className="mt-4">
          <CachedCount name="a" />
          <CachedCount name="b" />
          <CachedCount name="a" />
        </ul>
      </Suspense>
      <ul className="mt-4">
        <Suspense fallback={<li>live: ...</li>}>
          <LiveCount />
        </Suspense>
      </ul>
    </main>
  );
}

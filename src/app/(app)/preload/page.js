import { Suspense } from "react";
import PreloadParent from "@/components/PreloadParent";

export default function PreloadPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <Suspense fallback={<p>Loading...</p>}>
        <PreloadParent />
      </Suspense>
    </main>
  );
}

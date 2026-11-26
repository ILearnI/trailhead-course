import { Suspense } from "react";
import StudioGate from "@/components/StudioGate";

export default function StudioLayout({ children, nav, who }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl gap-8 p-4 md:p-8">
      <aside className="w-48 shrink-0 space-y-4">
        <Suspense fallback={<p className="text-sm">Loading...</p>}>
          {who}
          {nav}
        </Suspense>
      </aside>
      <div className="min-w-0 flex-1">
        <Suspense fallback={<p>Loading...</p>}>
          <StudioGate>{children}</StudioGate>
        </Suspense>
      </div>
    </div>
  );
}

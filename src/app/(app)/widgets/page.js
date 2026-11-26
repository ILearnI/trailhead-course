import { Suspense } from "react";
import FlakyList from "@/components/FlakyList";
import MaybeMissing from "@/components/MaybeMissing";
import SlowPanel from "@/components/SlowPanel";
import WidgetBoundary from "@/components/WidgetBoundary";

export default function WidgetsPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Widgets</h1>
      <WidgetBoundary title="Trail names">
        <Suspense fallback={<p className="mt-4">Loading...</p>}>
          <FlakyList />
        </Suspense>
      </WidgetBoundary>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <SlowPanel title="Steady" delay={500} />
      </Suspense>
      <WidgetBoundary title="Maybe missing">
        <Suspense fallback={<p className="mt-4">Loading...</p>}>
          <MaybeMissing searchParams={searchParams} />
        </Suspense>
      </WidgetBoundary>
    </main>
  );
}

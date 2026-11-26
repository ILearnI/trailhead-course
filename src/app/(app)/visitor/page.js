import { Suspense } from "react";
import VisitorInfo from "@/components/VisitorInfo";

export default function VisitorPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Visitor</h1>
      <Suspense fallback={<p className="mt-4">Reading the request...</p>}>
        <VisitorInfo searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

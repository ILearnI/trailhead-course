import { Suspense } from "react";
import { getEntry } from "@/lib/cms";
import { exitPreview } from "./actions";

async function Headline() {
  const { text, draft } = await getEntry("headline");
  return (
    <>
      {draft && (
        <aside role="status" className="mb-4 rounded border p-3">
          Preview mode is on.
          <form action={exitPreview}>
            <button id="exit" type="submit" className="underline">
              Exit preview
            </button>
          </form>
        </aside>
      )}
      <p data-news="headline">{text}</p>
    </>
  );

}

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">News</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Headline />
      </Suspense>
    </main>
  );
}

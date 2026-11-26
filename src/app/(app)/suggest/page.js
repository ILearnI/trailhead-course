import { Suspense } from "react";
import { suggestTrail } from "@/app/actions";
import UploadError from "@/components/UploadError";

export default function SuggestPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Suggest a trail</h1>
      <Suspense fallback={null}>
        <UploadError searchParams={searchParams} />
      </Suspense>
      <form action={suggestTrail} id="suggest-form" className="mt-6 space-y-2">
        <input
          name="name"
          placeholder="Name of the trail"
          className="block rounded-lg border bg-surface px-3 py-2"
        />
        <label className="block text-sm">
          Photo
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            className="mt-1 block"
          />
        </label>
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
          Suggest
        </button>
      </form>
    </main>
  );
}

import { guides } from "@/data/guides";
import Breadcrumbs from "../Breadcrumbs";

export function generateStaticParams() {
  return Object.keys(guides).map((path) => ({ slug: path.split("/") }));
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = guides[slug.join("/")];

  if (!guide) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-semibold">Guide not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Breadcrumbs slug={slug} />
      <h1 className="text-3xl font-semibold">{guide.title}</h1>
      <p className="mt-4 text-zinc-600">{guide.text}</p>
    </main>
  );
}

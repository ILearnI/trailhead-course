export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["install"] }, { slug: ["config", "env"] }];
}

export default async function DocsPage({ params }) {
  const { slug = [] } = await params;
  const where = slug.length === 0 ? "Docs home" : slug.join(" / ");

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Docs</h1>
      <p className="mt-2 text-zinc-600">{where}</p>
    </main>
  );
}

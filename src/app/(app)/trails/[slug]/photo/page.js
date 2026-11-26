import { trailParams } from "@/lib/trails";
import PhotoContent from "@/components/PhotoContent";

export function generateStaticParams() {
  return trailParams();
}

export default async function PhotoPage({ params }) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <PhotoContent slug={slug} />
    </main>
  );
}

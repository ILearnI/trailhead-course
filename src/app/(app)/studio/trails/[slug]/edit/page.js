import { notFound } from "next/navigation";
import DeleteTrail from "@/components/DeleteTrail";
import TrailForm from "@/components/TrailForm";
import { getEditableTrail } from "@/dal/trail-writes";

export const metadata = { title: "Studio: edit trail" };

export default async function EditTrail({ params }) {
  const { slug } = await params;
  const trail = await getEditableTrail(slug);
  if (!trail) notFound();
  return (
    <section>
      <h1 className="text-3xl font-semibold">{`Edit ${trail.name}`}</h1>
      <TrailForm trail={trail} />
      <DeleteTrail slug={trail.slug} />
    </section>
  );
}

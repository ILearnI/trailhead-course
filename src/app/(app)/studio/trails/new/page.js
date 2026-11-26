import TrailForm from "@/components/TrailForm";
import { requirePermission } from "@/dal/auth";

export const metadata = { title: "Studio: new trail" };

export default async function NewTrail() {
  await requirePermission("trail:write");
  return (
    <section>
      <h1 className="text-3xl font-semibold">New trail</h1>
      <TrailForm />
    </section>
  );
}

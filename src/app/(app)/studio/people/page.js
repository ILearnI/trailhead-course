import AdminUsers from "@/components/AdminUsers";
import { requirePermission } from "@/dal/auth";

export const metadata = { title: "Studio: people" };

export default async function StudioPeople() {
  await requirePermission("user:set-role");
  return (
    <section>
      <h1 className="text-3xl font-semibold">People</h1>
      <AdminUsers />
    </section>
  );
}

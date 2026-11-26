import { Suspense } from "react";
import { connection } from "next/server";
import AdminUsers from "@/components/AdminUsers";

export const metadata = { title: "Admin" };
export const instant = false;

export default async function AdminPage() {
  await connection();
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <AdminUsers />
      </Suspense>
    </main>
  );
}

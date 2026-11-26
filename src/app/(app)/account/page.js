import { Suspense } from "react";
import { connection } from "next/server";
import AccountPanel from "@/components/AccountPanel";

export const metadata = { title: "Account" };
export const instant = false;

export default async function AccountPage() {
  await connection();
  return (
    <main className="mx-auto max-w-md p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Your account</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <AccountPanel />
      </Suspense>
    </main>
  );
}

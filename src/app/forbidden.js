import Link from "next/link";

export const metadata = { title: "Forbidden" };

export default function Forbidden() {
  return (
    <main className="mx-auto max-w-md p-4 md:p-8">
      <h1 className="text-3xl font-semibold">403: not allowed</h1>
      <p className="mt-2">Your account cannot open this page.</p>
      <Link href="/account" className="mt-4 inline-block underline">
        Back to your account
      </Link>
    </main>
  );
}

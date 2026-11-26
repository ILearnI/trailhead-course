import Link from "next/link";

export const metadata = { title: "Sign in" };

export default function Unauthorized() {
  return (
    <main className="mx-auto max-w-md p-4 md:p-8">
      <h1 className="text-3xl font-semibold">401: sign in first</h1>
      <p className="mt-2">We could not find your account.</p>
      <Link href="/login" className="mt-4 inline-block underline">
        Log in
      </Link>
    </main>
  );
}

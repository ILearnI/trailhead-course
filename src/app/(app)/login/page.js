import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Log in", robots: { index: false } };

// Reads ?next=, so it waits for the request
async function Form({ searchParams }) {
  const { next } = await searchParams;
  return <LoginForm next={next} />;
}

export default function LoginPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-md p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Log in</h1>
      <Suspense fallback={null}>
        <Form searchParams={searchParams} />
      </Suspense>
      <p className="mt-4 text-sm">
        No account? <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </main>
  );
}

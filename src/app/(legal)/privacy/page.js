export const metadata = {
  title: "Privacy",
  description:
    "What we count, what we store, and the choices you have, in plain words.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">Privacy</h1>
      <p className="mt-4 text-zinc-600">
        If you agree, we count the pages that are read. We store the path of the
        page, and nothing about you: no cookie, no identifier, no address.
      </p>
      <ul className="mt-4 list-disc pl-6 text-zinc-600">
        <li>session: keeps you signed in, only if you log in.</li>
        <li>consent: remembers your choice, for a year.</li>
      </ul>
      <p className="mt-4 text-zinc-600">
        We obey Do Not Track and Global Privacy Control, and we do not ask.
      </p>
    </main>
  );
}

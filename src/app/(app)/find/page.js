import FindForm from "@/components/FindForm";

export const metadata = {
  title: "Find a trail",
  description: "Describe the trail that you want in your own words.",
  alternates: { canonical: "/find" },
};

export default function FindPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Find a trail</h1>
      <p className="mt-2 text-zinc-600">Say it in your own words.</p>
      <FindForm />
    </main>
  );
}

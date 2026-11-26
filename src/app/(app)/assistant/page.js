import TrailAssistant from "@/components/TrailAssistant";

export const metadata = {
  title: "Trail assistant",
  description: "Ask questions about the trails, and get a short answer.",
  alternates: { canonical: "/assistant" },
};

export default function AssistantPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Trail assistant</h1>
      <p className="mt-2 text-zinc-600">Ask about our trails.</p>
      <TrailAssistant />
    </main>
  );
}

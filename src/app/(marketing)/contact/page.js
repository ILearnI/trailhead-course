import { Suspense } from "react";
import TopicEcho from "@/components/TopicEcho";
import ContactNote from "@/components/ContactNote";
import MessageForm from "@/components/MessageForm";
import MessageList from "@/components/MessageList";

export const metadata = {
  title: "Contact",
  description:
    "Ways to reach the Trailhead team: our email, and a form for your questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage({ searchParams }) {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">Contact us</h1>
      <p className="mt-4 text-zinc-600">hello@trailhead.test</p>
      <p className="mt-2 text-zinc-600">We answer from Monday to Friday.</p>
      <form className="mt-6 flex gap-2" id="topic-form">
        <label htmlFor="ask-topic" className="sr-only">Topic</label>
        <input id="ask-topic" name="topic" placeholder="Topic" className="rounded-lg border bg-surface px-3 py-2" />
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-white">
          Ask
        </button>
      </form>
      <Suspense fallback={null}>
        <TopicEcho searchParams={searchParams} />
      </Suspense>
      <ContactNote />
      <MessageForm />
      <Suspense fallback={null}>
        <MessageList />
      </Suspense>
    </main>
  );
}

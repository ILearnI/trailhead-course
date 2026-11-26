import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/json-ld";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to the questions we hear most: accounts, reviews, and trail guides.",
  alternates: { canonical: "/faq" },
};

const questions = [
  { q: "Do I need an account?", a: "Only to write reviews and save favourites." },
  { q: "Are the trails free?", a: "Yes. Every trail guide is free to read." },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">FAQ</h1>
      <JsonLd data={faqJsonLd(questions)} />
      {questions.map((item) => (
        <div key={item.q} className="mt-4">
          <p className="font-medium">{item.q}</p>
          <p className="text-zinc-600">{item.a}</p>
        </div>
      ))}
    </main>
  );
}

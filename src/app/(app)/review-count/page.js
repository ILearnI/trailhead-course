import ReviewCounter from "@/components/ReviewCounter";

export const metadata = { title: "Live reviews" };

export default function ReviewCountPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Live reviews</h1>
      <ReviewCounter />
    </main>
  );
}

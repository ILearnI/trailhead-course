import Image from "next/image";
import Promo from "./Promo";
import Stats from "./Stats";
import TopReviews from "./TopReviews";

export default function SluggishPage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <Promo />
      <h1 className="text-3xl font-semibold">Alpine Lake Loop</h1>
      <Image
        src="http://localhost:4001/alpine-lake.jpg"
        alt="The alpine lake, under the peaks"
        width={1600}
        height={1000}
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 768px) 48rem, 100vw"
        className="mt-4 w-full rounded-xl"
      />
      <p className="mt-4">
        A loop around a glacial lake, under the peaks. Bring water, and a jacket.
      </p>
      <Stats />
      <TopReviews />
    </main>
  );
}

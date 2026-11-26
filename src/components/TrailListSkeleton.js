import TrailCardSkeleton from "@/components/TrailCardSkeleton";

export default function TrailListSkeleton() {
  return (
    <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {Array.from({ length: 6 }, (_, index) => (
        <TrailCardSkeleton key={index} />
      ))}
    </ul>
  );
}

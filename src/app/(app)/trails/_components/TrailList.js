import TrailCard from "@/components/TrailCard";

export default function TrailList({ items }) {
  return (
    <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {items.map((trail) => (
        <TrailCard key={trail.slug} trail={trail} />
      ))}
    </ul>
  );
}

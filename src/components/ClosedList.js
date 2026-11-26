import { fetchClosures } from "@/lib/api";

export default async function ClosedList() {
  const closed = await fetchClosures();
  if (closed.length === 0) return <p className="mt-4 text-sm">No trail is closed.</p>;

  return (
    <ul className="mt-4 space-y-1 text-sm">
      {closed.map((slug, index) => (
        <li key={index}>{`Closed: ${slug}`}</li>
      ))}
    </ul>
  );
}

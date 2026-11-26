import { fetchTrails } from "@/lib/api";

export default async function TrailCountLine() {
  const trails = await fetchTrails(1500);
  return <p className="mt-4">{`${trails.length} trails`}</p>;
}

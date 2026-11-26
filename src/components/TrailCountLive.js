import { fetchTrails } from "@/lib/api";

export default async function TrailCountLive() {
  const trails = await fetchTrails();

  return <p className="mt-4">{`${trails.length} trails in the API`}</p>;
}

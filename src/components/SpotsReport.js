import { checkSpots } from "@/lib/spots";

export default async function SpotsReport({ searchParams }) {
  const { hikers = "2" } = await searchParams;
  const result = await checkSpots(hikers);
  if (!result.ok) return <p className="mt-4 text-red-600">{result.message}</p>;

  return <p className="mt-4">{`Reserved for ${result.reserved} hikers.`}</p>;
}

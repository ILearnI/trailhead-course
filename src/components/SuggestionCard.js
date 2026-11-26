import { notFound } from "next/navigation";
import { fetchSuggestion } from "@/lib/api";

export default async function SuggestionCard({ params }) {
  const { id } = await params;
  const suggestion = await fetchSuggestion(id);
  if (!suggestion) notFound();

  return <p className="mt-4">{`We received your suggestion: ${suggestion.name}`}</p>;
}

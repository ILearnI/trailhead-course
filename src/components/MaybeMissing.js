import { notFound } from "next/navigation";

export default async function MaybeMissing({ searchParams }) {
  const { missing } = await searchParams;
  if (missing) notFound();

  return <p className="mt-4">This widget is here.</p>;
}

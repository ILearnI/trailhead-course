export default async function TopicEcho({ searchParams }) {
  const { topic } = await searchParams;
  if (!topic) return null;

  return <p className="mt-4">{`You asked about ${topic}.`}</p>;
}

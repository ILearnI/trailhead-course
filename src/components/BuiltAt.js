export default async function BuiltAt() {
  "use cache";

  const time = new Date().toISOString().slice(11, 19);
  return <p className="mt-4">{`Built at: ${time}`}</p>;
}

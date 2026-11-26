import { io } from "next/cache";

export default async function Now() {
  // Everything after this runs per request
  await io();
  const time = new Date().toISOString().slice(11, 19);
  const code = crypto.randomUUID().slice(0, 8);

  return (
    <ul className="mt-4 space-y-1">
      <li>{`Now: ${time}`}</li>
      <li>{`Visit code: ${code}`}</li>
    </ul>
  );
}

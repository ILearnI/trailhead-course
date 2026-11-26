import { loadSafe, loadUnsafe } from "@/lib/failing";

export default async function FailureReport() {
  const unsafe = await loadUnsafe();
  let message = "ok";
  try {
    await loadSafe("/trails?fail=1");
  } catch (error) {
    message = error.message;
  }

  let slow = "ok";
  try {
    await loadSafe("/trails?delay=5000");
  } catch (error) {
    slow = error.name;
  }

  return (
    <ul className="mt-4 space-y-1">
      <li>{`Unchecked: ${JSON.stringify(unsafe)}`}</li>
      <li>{`Checked: ${message}`}</li>
      <li>{`Slow: ${slow}`}</li>
    </ul>
  );
}

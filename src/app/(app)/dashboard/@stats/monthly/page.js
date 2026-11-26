import Link from "next/link";

export default function MonthlyStats() {
  return (
    <div>
      <h2 className="font-semibold">Monthly stats</h2>
      <p className="mt-2 text-sm">Hikes per month will go here.</p>
      <Link href="/dashboard" className="mt-2 inline-block text-sm underline">
        Back to the summary
      </Link>
    </div>
  );
}

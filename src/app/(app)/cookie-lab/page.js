import { openLabSession } from "./actions";

export default function CookieLabPage() {
  return (
    <main className="mx-auto max-w-md p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Cookie lab</h1>
      <form action={openLabSession} className="mt-4">
        <button type="submit" className="underline">Open a session</button>
      </form>
    </main>
  );
}

import { cookies, headers } from "next/headers";

export default async function VisitorInfo({ searchParams }) {
  // None of this exists at build time
  const cookieStore = await cookies();
  const headerList = await headers();
  const { name } = await searchParams;
  const seen = cookieStore.get("seen")?.value ?? "no";
  const agent = headerList.get("user-agent") ?? "unknown";

  return (
    <ul className="mt-4 space-y-1 text-sm">
      <li>{`Hello, ${name ?? "hiker"}`}</li>
      <li>{`Cookie seen: ${seen}`}</li>
      <li>{`Agent: ${agent}`}</li>
    </ul>
  );
}

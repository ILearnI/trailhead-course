import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const visits = Number(jar.get("visits")?.value ?? 0) + 1;
  jar.set("visits", String(visits), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
  return Response.json({ visits });
}

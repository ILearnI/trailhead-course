import { connection } from "next/server";
import { counts } from "@/lib/calls";

export async function GET() {
  // Wait for a request: not a build-time answer
  await connection();
  return Response.json(counts());
}

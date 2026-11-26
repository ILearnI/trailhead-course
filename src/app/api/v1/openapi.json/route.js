import { spec } from "@/lib/openapi";

// Public: the description needs no key
export async function GET() {
  return Response.json(spec);
}

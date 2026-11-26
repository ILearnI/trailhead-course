import { revalidateTag } from "next/cache";
import { verifySignature } from "@/lib/webhook";
import { tags } from "@/lib/tags";

// Deliveries already handled (one server)
const seen = (globalThis.webhookDeliveries ??= new Set());

export async function POST(request) {
  // The raw text: the signature covers it
  const body = await request.text();
  const signature = request.headers.get("x-signature");
  if (!verifySignature(process.env.WEBHOOK_SECRET, body, signature)) {
    return Response.json({ error: "Bad signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ error: "The body must be JSON" }, { status: 400 });
  }

  // A delivery can arrive twice: once only
  const id = request.headers.get("x-delivery-id");
  if (id && seen.has(id)) return Response.json({ duplicate: true });
  if (id) seen.add(id);

  if (event.type === "trails.updated") {
    revalidateTag(tags.trails, "max");
    return Response.json({ received: true, revalidated: ["trails"] });
  }
  // Unknown events: answer 200, no retry
  return Response.json({ received: true, ignored: event.type });
}

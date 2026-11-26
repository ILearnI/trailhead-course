import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get("secret");
  // Only the CMS knows the secret
  if (!process.env.DRAFT_SECRET || secret !== process.env.DRAFT_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }
  (await draftMode()).enable();
  redirect("/news");
}

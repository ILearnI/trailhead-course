import Link from "next/link";
import { getMyReviewCount } from "@/dal/my-count";
import { findUserById } from "@/dal/users";
import { getSession } from "@/lib/session";

export default async function UserMenu() {
  const session = await getSession();
  const user = session ? await findUserById(session.userId) : null;
  if (!user) return <Link href="/login">Log in</Link>;
  const total = await getMyReviewCount();
  return <Link href="/account">{`Hi, ${user.name} (${total})`}</Link>;
}

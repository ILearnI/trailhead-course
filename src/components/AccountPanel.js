import Link from "next/link";
import { getCurrentUser } from "@/dal/auth";
import { logout } from "@/app/(app)/login/actions";

export default async function AccountPanel() {
  const user = await getCurrentUser();

  return (
    <div className="mt-4">
      <p>{`Signed in as ${user.name} (${user.email}).`}</p>
      <p className="mt-2">
        <Link href="/account/reviews" className="underline">Your reviews</Link>
      </p>
      <form action={logout} className="mt-4">
        <button type="submit" className="underline">Log out</button>
      </form>
    </div>
  );
}

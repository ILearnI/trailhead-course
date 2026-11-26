import { getCurrentUser } from "@/dal/auth";

// Who is signed in, and with which role
export default async function Who() {
  const user = await getCurrentUser();
  return (
    <p className="text-sm">
      {user.name}
      <span className="block text-zinc-500">{user.role}</span>
    </p>
  );
}

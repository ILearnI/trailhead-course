import { cookies } from "next/headers";
import { getUserCount } from "@/lib/profile";

export default async function UserCount() {
  // The only place that reads the request
  const store = await cookies();
  const user = store.get("user")?.value ?? "guest";
  const { count } = await getUserCount(user);

  return <p className="mt-4">{`${user}: ${count}`}</p>;
}

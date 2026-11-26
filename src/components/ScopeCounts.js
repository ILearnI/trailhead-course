import { cookies } from "next/headers";
import { getPrivateCount, getRemoteCount } from "@/lib/scopes";

export default async function ScopeCounts() {
  const first = await getPrivateCount();
  const second = await getPrivateCount();
  const store = await cookies();
  const user = store.get("user")?.value ?? "guest";
  const remote = await getRemoteCount(user);

  return (
    <ul>
      <li>{`private first: ${first.count}`}</li>
      <li>{`private second: ${second.count}`}</li>
      <li>{`remote: ${remote.count}`}</li>
    </ul>
  );
}

import { fetchCount } from "@/lib/api";
import LiveHikers from "@/components/LiveHikers";

export default async function HikersPanel() {
  const initial = await fetchCount("hikers");

  return <LiveHikers initial={initial} />;
}

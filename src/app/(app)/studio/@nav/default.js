import StudioNavLinks from "@/components/StudioNavLinks";
import { getCurrentUser } from "@/dal/auth";
import { navFor } from "@/lib/studio-nav";

// The menu: only the sections of this person
export default async function Nav() {
  const user = await getCurrentUser();
  return <StudioNavLinks items={navFor(user)} />;
}

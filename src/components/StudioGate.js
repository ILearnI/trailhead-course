import { requirePermission } from "@/dal/auth";

// Nobody sees the studio without the permission
export default async function StudioGate({ children }) {
  await requirePermission("studio:view");
  return children;
}

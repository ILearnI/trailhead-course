import { can } from "@/lib/permissions";

// The sections of the studio, and who may open them
const SECTIONS = [
  { href: "/studio", label: "Overview", permission: "studio:view" },
  { href: "/studio/trails", label: "Trails", permission: "trail:write" },
  { href: "/studio/reviews", label: "Reviews", permission: "review:delete:any" },
  { href: "/studio/people", label: "People", permission: "user:set-role" },
];

// The menu of one user: only what they may open
export function navFor(user) {
  return SECTIONS.filter((section) => can(user, section.permission));
}

// Which permissions each role has
const ROLES = {
  user: ["review:create", "review:delete:own"],
  editor: [
    "review:create",
    "review:delete:own",
    "review:delete:any",
    "studio:view",
    "trail:write",
  ],
  admin: [
    "review:create",
    "review:delete:own",
    "review:delete:any",
    "user:read",
    "user:set-role",
    "studio:view",
    "trail:write",
  ],
};

// Can this user do this? Unknown means no
export function can(user, permission) {
  const allowed = ROLES[user?.role] ?? [];
  return allowed.includes(permission);
}

export const ROLE_NAMES = Object.keys(ROLES);

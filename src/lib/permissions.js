// Which permissions each role has
const ROLES = {
  user: ["review:create", "review:delete:own"],
  admin: [
    "review:create",
    "review:delete:own",
    "review:delete:any",
    "user:read",
    "user:set-role",
  ],
};

// Can this user do this? Unknown means no
export function can(user, permission) {
  const allowed = ROLES[user?.role] ?? [];
  return allowed.includes(permission);
}

export const ROLE_NAMES = Object.keys(ROLES);

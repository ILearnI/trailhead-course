import { can } from "../src/lib/permissions.js";

const users = [
  { name: "Tom", role: "user" },
  { name: "Maya", role: "admin" },
  { name: "Nobody", role: "owner" },
];
const permissions = ["review:create", "review:delete:any", "user:set-role"];

// A line for each user, and each permission
for (const user of users) {
  for (const permission of permissions) {
    console.log(`${user.name} (${user.role}): ${permission} -> ${can(user, permission)}`);
  }
}

import { listUsers } from "@/dal/admin";
import { changeRole } from "@/app/(app)/admin/actions";
import { ROLE_NAMES } from "@/lib/permissions";

export default async function AdminUsers() {
  const items = await listUsers();

  return (
    <ul className="mt-4 space-y-3">
      {items.map((user) => (
        <li key={user.id}>
          {`${user.name} (${user.email}): ${user.role}`}
          <form action={changeRole} className="ml-3 inline">
            <input type="hidden" name="id" value={user.id} />
            <select name="role" defaultValue={user.role}>
              {ROLE_NAMES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <button type="submit" className="ml-2 underline">Save</button>
          </form>
        </li>
      ))}
    </ul>
  );
}

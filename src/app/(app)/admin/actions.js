"use server";

import { revalidatePath } from "next/cache";
import { setRole } from "@/dal/admin";
import { ROLE_NAMES } from "@/lib/permissions";

export async function changeRole(formData) {
  const id = Number(formData.get("id"));
  const role = String(formData.get("role"));
  if (!Number.isInteger(id) || !ROLE_NAMES.includes(role)) return;
  await setRole(id, role);
  revalidatePath("/admin");
}

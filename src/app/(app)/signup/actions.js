"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createUser, findUserByEmail } from "@/dal/users";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/signup-schema";

const TAKEN = "An account with this email already exists";

export async function signUp(prevState, formData) {
  const input = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // Never send the password back
  const values = { name: input.name, email: input.email };
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }
  const { name, email, password } = parsed.data;
  if (await findUserByEmail(email)) {
    return { errors: { email: [TAKEN] }, values };
  }
  const passwordHash = await hashPassword(password);
  try {
    await createUser({ name, email, passwordHash });
  } catch (error) {
    // Two sign-ups at once: the database decides
    if (String(error.message).includes("UNIQUE")) {
      return { errors: { email: [TAKEN] }, values };
    }
    throw error;
  }
  redirect("/signup/done");
}

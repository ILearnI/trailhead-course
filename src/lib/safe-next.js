// Only a path of this site: never another address
export function safeNext(value) {
  const next = String(value ?? "");
  const local = next.startsWith("/") && !next.startsWith("//");
  return local && !next.includes("\\") ? next : "/account";
}

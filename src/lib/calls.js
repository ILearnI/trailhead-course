// Counts how often a function really ran
export function count(name) {
  globalThis.__calls ??= {};
  globalThis.__calls[name] = (globalThis.__calls[name] ?? 0) + 1;
}

export function counts() {
  return globalThis.__calls ?? {};
}

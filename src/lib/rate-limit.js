// Attempts per key. In memory: one server only
const attempts = (globalThis.rateLimitAttempts ??= new Map());

// Allow `limit` attempts in each `windowMs`
export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    attempts.set(key, recent);
    const wait = Math.ceil((recent[0] + windowMs - now) / 1000);
    return { ok: false, retryAfter: wait };
  }
  attempts.set(key, [...recent, now]);
  return { ok: true, retryAfter: 0 };
}

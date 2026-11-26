import { createHash, timingSafeEqual } from "node:crypto";

// The hash of a key: sha256, in hex
export function hashKey(key) {
  return createHash("sha256").update(key).digest("hex");
}

// The clients: name:hash,name:hash
function clients() {
  return (process.env.API_KEYS ?? "")
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [name, hash] = entry.split(":");
      return { name, hash };
    });
}

// The client that owns the key, or null
export function findClient(request) {
  const key = request.headers.get("x-api-key");
  if (!key) return null;
  const received = Buffer.from(hashKey(key));
  for (const client of clients()) {
    const expected = Buffer.from(client.hash);
    if (expected.length === received.length && timingSafeEqual(expected, received)) {
      return client.name;
    }
  }
  return null;
}

import { createClient } from "redis";

// Is the cache there? Never throws or waits
export async function pingCache() {
  const client = createClient({
    url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
    socket: { connectTimeout: 500, reconnectStrategy: false },
  });
  client.on("error", () => {});
  try {
    await client.connect();
    await client.ping();
    return true;
  } catch {
    return false;
  } finally {
    client.destroy();
  }
}

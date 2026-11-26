const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
});
// A broken Redis must not break the pages
client.on("error", () => {});
const ready = client.connect();

// Entries are read from a stream only once
async function bytesOf(stream) {
  return Buffer.from(await new Response(stream).arrayBuffer());
}

// Every hit gets its own stream
function streamOf(bytes) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(bytes));
      controller.close();
    },
  });
}

module.exports = {
  async set(cacheKey, pendingEntry) {
    try {
      const { value, ...entry } = await pendingEntry;
      const bytes = await bytesOf(value);
      await ready;
      await client.set(
        `cache:${cacheKey}`,
        JSON.stringify({ ...entry, value: bytes.toString("base64") }),
        // Redis removes the entry when it expires
        { EX: Math.max(1, Math.ceil(entry.expire)) },
      );
    } catch {}
  },

  async get(cacheKey) {
    try {
      await ready;
      const json = await client.get(`cache:${cacheKey}`);
      if (!json) return undefined;
      const { value, ...entry } = JSON.parse(json);
      let revalidate = entry.revalidate;
      const keys = entry.tags.map((tag) => `tag:${tag}`);
      const stamps = keys.length > 0 ? await client.mGet(keys) : [];
      for (const raw of stamps) {
        const { stale = 0, expired = 0 } = raw ? JSON.parse(raw) : {};
        // Ended after this entry was made
        if (expired > entry.timestamp && expired <= Date.now()) {
          return undefined;
        }
        if (stale > entry.timestamp) revalidate = -1;
      }
      return { ...entry, revalidate, value: streamOf(Buffer.from(value, "base64")) };
    } catch {
      return undefined;
    }
  },

  // The tag times live in Redis, nothing to sync
  async refreshTags() {},

  async getExpiration(tags) {
    if (tags.length === 0) return 0;
    try {
      await ready;
      const stamps = await client.mGet(tags.map((tag) => `tag:${tag}`));
      const times = stamps.flatMap((raw) => {
        const { stale = 0, expired = 0 } = raw ? JSON.parse(raw) : {};
        return [stale, expired];
      });
      return Math.max(0, ...times);
    } catch {
      return 0;
    }
  },

  async updateTags(tags, durations) {
    try {
      await ready;
      const now = Date.now();
      for (const tag of tags) {
        const stamp = durations
          ? { stale: now, expired: now + (durations.expire ?? 0) * 1000 }
          : { stale: 0, expired: now };
        await client.set(`tag:${tag}`, JSON.stringify(stamp));
      }
    } catch {}
  },
};

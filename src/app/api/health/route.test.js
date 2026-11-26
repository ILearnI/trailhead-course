import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.hoisted(() => vi.fn());
const pingCache = vi.hoisted(() => vi.fn());
vi.mock("@/db", () => ({ db: { get } }));
vi.mock("@/lib/redis-ping", () => ({ pingCache }));
vi.mock("next/server", () => ({ connection: async () => {} }));

import { GET } from "./route";

describe("GET /api/health", () => {
  beforeEach(() => {
    get.mockReset();
    pingCache.mockReset();
    pingCache.mockResolvedValue(true);
  });

  it("says ok when the database answers", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", database: "ok", cache: "ok" });
  });

  it("is degraded, but still 200, without the cache", async () => {
    pingCache.mockResolvedValue(false);
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ status: "degraded", database: "ok", cache: "down" });
  });

  it("says down, with a 503, when it does not", async () => {
    get.mockImplementation(() => {
      throw new Error("locked");
    });
    const response = await GET();
    expect(response.status).toBe(503);
    expect((await response.json()).status).toBe("down");
  });
});

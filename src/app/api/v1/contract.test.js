// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hashKey } from "@/lib/api-keys";
import { spec } from "@/lib/openapi";
import { createTestDb } from "@/test/db";
import { makeRequest, paramsOf } from "@/test/request";
import { seedTestDb } from "@/test/seed";
import { shapeOf } from "@/test/shape";

// The real layer, on a test database
const state = vi.hoisted(() => ({ db: null }));
vi.mock("@/db", () => ({
  get db() {
    return state.db;
  },
}));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

import { GET as getOne } from "./trails/[slug]/route";
import { GET as getList } from "./trails/route";

const KEY = "contract-key";
beforeEach(() => {
  state.db = createTestDb().db;
  seedTestDb(state.db);
  vi.stubEnv("API_KEYS", `contract:${hashKey(KEY)}`);
});
afterEach(() => vi.unstubAllEnvs());

// A request with the key, or without it
const ask = (path, key = KEY) =>
  makeRequest(path, { headers: key ? { "x-api-key": key } : {} });

describe("the list contract", () => {
  it("has the shape that the mobile apps rely on", async () => {
    const response = await getList(ask("/api/v1/trails"));
    expect(response.status).toBe(200);
    expect(shapeOf(await response.json())).toEqual({
      data: [
        { km: "number", level: "string", name: "string", region: "string", slug: "string" },
      ],
      meta: { limit: "number", page: "number", pages: "number", total: "number" },
    });
  });

  it("says its version, in the headers", async () => {
    const response = await getList(ask("/api/v1/trails"));
    expect(response.headers.get("x-api-version")).toBe("1");
    expect(response.headers.get("content-type")).toMatch(/application\/json/);
  });

  it("keeps the paging promises", async () => {
    const response = await getList(ask("/api/v1/trails?limit=2&page=2"));
    const { data, meta } = await response.json();
    expect(data).toHaveLength(2);
    expect(meta).toMatchObject({ page: 2, limit: 2 });
    expect(meta.pages).toBe(Math.ceil(meta.total / 2));
  });
});

describe("the detail contract", () => {
  it("wraps one trail in a data object", async () => {
    const params = paramsOf({ slug: "alpine-lake" });
    const response = await getOne(ask("/api/v1/trails/alpine-lake"), params);
    expect(response.status).toBe(200);
    expect(shapeOf(await response.json())).toEqual({
      data: {
        createdAt: "string",
        description: "string",
        id: "number",
        km: "number",
        level: "string",
        name: "string",
        region: "string",
        slug: "string",
      },
    });
  });
});

describe("the error contract", () => {
  const errorShape = { error: { code: "string", message: "string" } };

  it("answers 401 with the code invalid_key", async () => {
    const response = await getList(ask("/api/v1/trails", null));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(shapeOf(body)).toEqual(errorShape);
    expect(body.error.code).toBe("invalid_key");
  });

  it("answers 400 with the code invalid_region", async () => {
    const response = await getList(ask("/api/v1/trails?region=moon"));
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("invalid_region");
  });

  it("answers 404 with the code not_found", async () => {
    const params = paramsOf({ slug: "nowhere" });
    const response = await getOne(ask("/api/v1/trails/nowhere"), params);
    expect(response.status).toBe(404);
    expect((await response.json()).error.code).toBe("not_found");
  });
});

describe("the description of the api", () => {
  const list = spec.paths["/trails"].get;
  const allowed = (name) => list.parameters.find((param) => param.name === name).schema.enum;

  it("lists the parameters that the handler reads", () => {
    const names = list.parameters.map((param) => param.name).sort();
    expect(names).toEqual(["level", "limit", "page", "region"]);
  });

  it("documents values that the handler accepts", async () => {
    for (const region of allowed("region")) {
      const response = await getList(ask(`/api/v1/trails?region=${region}`));
      expect(response.status).toBe(200);
    }
    for (const level of allowed("level")) {
      const response = await getList(ask(`/api/v1/trails?level=${level}`));
      expect(response.status).toBe(200);
    }
  });
});

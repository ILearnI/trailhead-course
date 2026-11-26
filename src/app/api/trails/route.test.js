// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { makeRequest } from "@/test/request";

// The layer: three known trails, and no database
const trail = (slug, name, region, level, km) => ({ slug, name, region, level, km });
const TRAILS = [
  trail("alpine-lake", "Alpine Lake Loop", "alps", "Moderate", 8.4),
  trail("cedar-falls", "Cedar Falls", "coast", "Easy", 4.2),
  trail("salt-marsh", "Salt Marsh Walk", "coast", "Easy", 3.5),
];
vi.mock("server-only", () => ({}));
vi.mock("@/dal/trails", () => ({ listTrails: async () => TRAILS }));

import { GET } from "./route";

describe("GET /api/trails", () => {
  it("answers 200 with json, a count, and the items", async () => {
    const response = await GET(makeRequest("/api/trails"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/application\/json/);
    expect(await response.json()).toEqual({ count: 3, items: TRAILS });
  });

  it("filters by region", async () => {
    const response = await GET(makeRequest("/api/trails?region=coast"));
    const body = await response.json();
    expect(body.count).toBe(2);
    expect(body.items.every((trail) => trail.region === "coast")).toBe(true);
  });

  it("answers 400 for an unknown region", async () => {
    const response = await GET(makeRequest("/api/trails?region=moon"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Unknown region" });
  });

  it("puts the total, and CORS, in the headers", async () => {
    const response = await GET(makeRequest("/api/trails?region=coast"));
    expect(response.headers.get("x-total-count")).toBe("2");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });
});

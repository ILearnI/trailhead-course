// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// Created before the mocks, which are hoisted
const { parseSearch } = vi.hoisted(() => ({ parseSearch: vi.fn() }));
vi.mock("@/lib/search-ai", () => ({ parseSearch }));
vi.mock("@/dal/trails", () => ({
  listTrails: async () => [
    { slug: "cedar-falls", name: "Cedar Falls", region: "coast", level: "Easy", km: 4.2 },
    { slug: "ridge-line", name: "Ridge Line", region: "alps", level: "Hard", km: 14.6 },
  ],
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "7.7.7.7" }),
}));

import { findByWords } from "./actions";

const form = (sentence) => {
  const data = new FormData();
  data.set("sentence", sentence);
  return data;
};

beforeEach(() => {
  parseSearch.mockReset();
});

describe("findByWords", () => {
  it("returns the filters and the trails that match", async () => {
    parseSearch.mockResolvedValue({ region: "coast", level: null, maxKm: null });
    const state = await findByWords({}, form("by the sea"));
    expect(state.trails.map((trail) => trail.slug)).toEqual(["cedar-falls"]);
    expect(state.intent.region).toBe("coast");
  });

  it("asks for a sentence, and does not call the model", async () => {
    const state = await findByWords({}, form("   "));
    expect(state.error).toBe("Describe the trail that you want.");
    expect(parseSearch).not.toHaveBeenCalled();
  });

  it("refuses a very long sentence, and does not call the model", async () => {
    const state = await findByWords({}, form("a".repeat(201)));
    expect(state.error).toContain("under 200 characters");
    expect(parseSearch).not.toHaveBeenCalled();
  });

  it("tells that the search is not available when the model fails", async () => {
    parseSearch.mockRejectedValue(new Error("down"));
    const state = await findByWords({}, form("a hike"));
    expect(state.error).toBe("The search is not available. Try again.");
  });

  it("stops a visitor who searches too often", async () => {
    parseSearch.mockResolvedValue({ region: null, level: null, maxKm: null });
    let state;
    for (let i = 0; i < 12; i += 1) state = await findByWords({}, form("a hike"));
    expect(state.error).toContain("Too many searches");
  });
});

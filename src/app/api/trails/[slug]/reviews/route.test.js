// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeRequest, paramsOf } from "@/test/request";

// Fakes for the layer, the session, and the cache
const state = vi.hoisted(() => ({ session: null }));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));
vi.mock("@/lib/session", () => ({ getSession: async () => state.session }));
vi.mock("@/dal/trails", () => ({
  getTrail: vi.fn(async (slug) => (slug === "alpine-lake" ? { slug } : null)),
}));
vi.mock("@/dal/reviews", () => ({
  listReviews: vi.fn(async () => [{ id: 1, rating: 5, text: "Clear water." }]),
  createReview: vi.fn(async () => ({ id: 13 })),
}));

import { revalidateTag } from "next/cache";
import { createReview } from "@/dal/reviews";
import { GET, POST } from "./route";

const good = { rating: 5, text: "Wonderful views, bring water." };
const ALPINE = paramsOf({ slug: "alpine-lake" });
const post = (body) =>
  POST(makeRequest("/api/trails/alpine-lake/reviews", { method: "POST", body }), ALPINE);

beforeEach(() => {
  state.session = { userId: 1 };
  vi.mocked(createReview).mockClear();
  vi.mocked(revalidateTag).mockClear();
});

describe("POST reviews", () => {
  it("answers 401 without a session, and writes nothing", async () => {
    state.session = null;
    const response = await post(good);
    expect(response.status).toBe(401);
    expect(createReview).not.toHaveBeenCalled();
  });

  it("answers 400 when the body is not JSON", async () => {
    const response = await post("not json");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "The body must be JSON" });
  });

  it("answers 400 with the errors by field", async () => {
    const response = await post({ rating: 9, text: "short" });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(Object.keys(body.errors).sort()).toEqual(["rating", "text"]);
    expect(createReview).not.toHaveBeenCalled();
  });

  it("answers 201 with the id, and expires the cached lists", async () => {
    const response = await post(good);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 13 });
    expect(createReview).toHaveBeenCalledWith({ slug: "alpine-lake", ...good, userId: 1 });
    expect(revalidateTag).toHaveBeenCalledWith("reviews:alpine-lake", "max");
    expect(revalidateTag).toHaveBeenCalledWith("ranking", "max");
  });

  it("answers 404 when the layer finds no trail", async () => {
    vi.mocked(createReview).mockResolvedValueOnce(null);
    const response = await post(good);
    expect(response.status).toBe(404);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe("GET reviews", () => {
  const get = (slug) =>
    GET(makeRequest(`/api/trails/${slug}/reviews`), paramsOf({ slug }));

  it("lists the reviews of a trail", async () => {
    const response = await get("alpine-lake");
    expect(response.status).toBe(200);
    expect((await response.json()).count).toBe(1);
  });

  it("answers 404 for an unknown trail", async () => {
    expect((await get("nowhere")).status).toBe(404);
  });
});

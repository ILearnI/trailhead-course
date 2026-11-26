import { beforeEach, describe, expect, it, vi } from "vitest";

const dal = vi.hoisted(() => ({ deleteReview: vi.fn() }));
const cache = vi.hoisted(() => ({ updateTag: vi.fn() }));
vi.mock("@/dal/moderation", () => dal);
vi.mock("next/cache", () => cache);

import { removeReview } from "./actions";

const form = (id) => {
  const data = new FormData();
  data.set("id", id);
  return data;
};

describe("removeReview", () => {
  beforeEach(() => vi.clearAllMocks());

  it("removes the review, and refreshes the two tags", async () => {
    dal.deleteReview.mockResolvedValue({ ok: true, slug: "a" });
    await removeReview(form("5"));
    expect(dal.deleteReview).toHaveBeenCalledWith(5);
    expect(cache.updateTag).toHaveBeenCalledWith("reviews:a");
    expect(cache.updateTag).toHaveBeenCalledWith("ranking");
  });

  it("refreshes nothing when the review does not exist", async () => {
    dal.deleteReview.mockResolvedValue({ ok: false });
    await removeReview(form("5"));
    expect(cache.updateTag).not.toHaveBeenCalled();
  });

  it("ignores an id that is not a number", async () => {
    await removeReview(form("abc"));
    await removeReview(form("-3"));
    expect(dal.deleteReview).not.toHaveBeenCalled();
  });
});

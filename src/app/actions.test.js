import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Replace next/cache with fakes that record calls
vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

// Replace next/headers: each test sets the cookies
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

// Like the real one, redirect throws
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  }),
}));

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addReview, closeTrail, suggestTrail } from "./actions";

// The form data that a browser would send
function formFor(fields) {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) form.append(name, value);
  return form;
}

// A valid review
const valid = {
  trail: "alpine-lake",
  name: "Ada",
  rating: "5",
  text: "Clear water, easy to follow.",
};

// Put every fake back after each test
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

// Make cookies() answer with this token, or none
function withCookie(token) {
  cookies.mockResolvedValue({
    get: (name) => (name === "ranger-token" && token ? { value: token } : undefined),
  });
}

describe("addReview", () => {
  it("returns the errors and the values for an invalid review", async () => {
    const state = await addReview({}, formFor({ ...valid, name: "A" }));
    expect(state.errors.name).toEqual(["Enter your name"]);
    expect(state.values.name).toBe("A");
    expect(state.ok).toBeUndefined();
  });

  it("does not call the API for an invalid review", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await addReview({}, formFor({ ...valid, text: "Nice" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses a trail that does not exist", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const state = await addReview({}, formFor({ ...valid, trail: "nowhere" }));
    expect(state.failed).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns failed when the API refuses the review", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 500 }));
    const state = await addReview({}, formFor(valid));
    expect(state.failed).toBe(true);
    expect(state.values.name).toBe("Ada");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/reviews"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("saves the review, and expires the reviews tag", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    const state = await addReview({}, formFor(valid));
    expect(state.ok).toBe(true);
    expect(updateTag).toHaveBeenCalledWith("reviews");
  });
});

describe("closeTrail", () => {
  beforeEach(() => vi.stubEnv("RANGER_TOKEN", "ranger-4711"));
  afterEach(() => vi.unstubAllEnvs());

  it("does nothing without a cookie", async () => {
    withCookie(undefined);
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await closeTrail(formFor({ slug: "ridge-line" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does nothing with a wrong token", async () => {
    withCookie("guess");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await closeTrail(formFor({ slug: "ridge-line" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("closes a trail for a ranger", async () => {
    withCookie("ranger-4711");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("[]"));
    await closeTrail(formFor({ slug: "ridge-line" }));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/closures"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("refuses a slug that is not a trail, even for a ranger", async () => {
    withCookie("ranger-4711");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await closeTrail(formFor({ slug: "nowhere" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("suggestTrail", () => {
  it("redirects to the form when there is no photo", async () => {
    const form = formFor({ name: "Tarn Loop" });
    await expect(suggestTrail(form)).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/suggest?error=missing");
  });

  it("redirects when the photo has the wrong type", async () => {
    const form = formFor({ name: "Tarn Loop" });
    form.append("photo", new File(["hello"], "notes.txt", { type: "text/plain" }));
    await expect(suggestTrail(form)).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/suggest?error=type");
  });
});

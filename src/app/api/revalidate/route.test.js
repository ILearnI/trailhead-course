// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));
import { revalidateTag } from "next/cache";
import { POST } from "./route";

// A POST request, with headers and a query
function call(headers = {}, query = "?tag=reviews") {
  const url = `http://localhost/api/revalidate${query}`;
  return POST(new Request(url, { method: "POST", headers }));
}

beforeEach(() => {
  vi.stubEnv("REVALIDATE_SECRET", "test-secret");
  vi.mocked(revalidateTag).mockClear();
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/revalidate", () => {
  it("answers 401 without the secret", async () => {
    const response = await call();
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("answers 401 with a wrong secret", async () => {
    const response = await call({ "x-revalidate-secret": "guess" });
    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("answers 401 when no secret is configured", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    const response = await call({ "x-revalidate-secret": "" });
    expect(response.status).toBe(401);
  });

  it("answers 400 for a missing tag, with the secret", async () => {
    const response = await call({ "x-revalidate-secret": "test-secret" }, "");
    expect(response.status).toBe(400);
  });

  it("revalidates the tag, with the secret", async () => {
    const response = await call({ "x-revalidate-secret": "test-secret" });
    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("reviews", "max");
  });
});

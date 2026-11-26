import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({ readPhoto: vi.fn() }));
vi.mock("@/lib/photo-store", () => store);

import { GET } from "./route";

const ask = (name) =>
  GET(new Request(`http://localhost/photos/${name}`), { params: Promise.resolve({ name }) });


describe("GET /photos/[name]", () => {
  beforeEach(() => store.readPhoto.mockReset());

  it("serves the bytes with the right headers", async () => {
    store.readPhoto.mockResolvedValue(Buffer.from("png"));
    const response = await ask("a.png");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cache-control")).toContain("immutable");
  });

  it("answers 404 when there is nothing", async () => {
    store.readPhoto.mockResolvedValue(null);
    expect((await ask("b.png")).status).toBe(404);
  });
});

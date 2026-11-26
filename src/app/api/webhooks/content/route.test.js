// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeRequest } from "@/test/request";
import { signBody } from "@/lib/webhook";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

import { revalidateTag } from "next/cache";
import { POST } from "./route";

const SECRET = "test-webhook-secret";

// A delivery, signed like the service signs it
function deliver(body, { secret = SECRET, id } = {}) {
  const headers = { "x-signature": signBody(secret, body) };
  if (id) headers["x-delivery-id"] = id;
  return POST(makeRequest("/api/webhooks/content", { method: "POST", body, headers }));
}

beforeEach(() => {
  vi.stubEnv("WEBHOOK_SECRET", SECRET);
  globalThis.webhookDeliveries?.clear();
  vi.mocked(revalidateTag).mockClear();
});
afterEach(() => vi.unstubAllEnvs());

const UPDATED = '{"type":"trails.updated"}';

describe("a good delivery", () => {
  it("answers 200, and expires the cache of the trails", async () => {
    const response = await deliver(UPDATED, { id: "d1" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, revalidated: ["trails"] });
    expect(revalidateTag).toHaveBeenCalledWith("trails", "max");
  });

  it("answers 200 for an event that it does not know", async () => {
    const response = await deliver('{"type":"review.created"}');
    expect(response.status).toBe(200);
    expect((await response.json()).ignored).toBe("review.created");
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe("a delivery that is refused", () => {
  it("answers 401 for a signature made with another secret", async () => {
    const response = await deliver(UPDATED, { secret: "another-secret" });
    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("answers 401 when the signature header is missing", async () => {
    const request = makeRequest("/api/webhooks/content", { method: "POST", body: UPDATED });
    expect((await POST(request)).status).toBe(401);
  });

  it("answers 401 when the body changed after signing", async () => {
    const headers = { "x-signature": signBody(SECRET, UPDATED) };
    const body = '{"type":"trails.updated","extra":true}';
    const request = makeRequest("/api/webhooks/content", { method: "POST", body, headers });
    expect((await POST(request)).status).toBe(401);
  });

  it("answers 401 for everybody when no secret is set", async () => {
    vi.stubEnv("WEBHOOK_SECRET", "");
    const response = await deliver(UPDATED, { secret: "" });
    expect(response.status).toBe(401);
  });

  it("answers 400 for a signed body that is not JSON", async () => {
    const response = await deliver("not json");
    expect(response.status).toBe(400);
  });
});

describe("a delivery that is replayed", () => {
  it("handles the same delivery id once", async () => {
    await deliver(UPDATED, { id: "d1" });
    const again = await deliver(UPDATED, { id: "d1" });
    expect(await again.json()).toEqual({ duplicate: true });
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("handles two different deliveries", async () => {
    await deliver(UPDATED, { id: "d1" });
    await deliver(UPDATED, { id: "d2" });
    expect(revalidateTag).toHaveBeenCalledTimes(2);
  });
});

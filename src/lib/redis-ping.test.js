import { beforeEach, describe, expect, it, vi } from "vitest";

const client = vi.hoisted(() => ({
  on: vi.fn(),
  connect: vi.fn(),
  ping: vi.fn(),
  destroy: vi.fn(),
}));
vi.mock("redis", () => ({ createClient: () => client }));

import { pingCache } from "./redis-ping";

describe("pingCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    client.connect.mockResolvedValue();
    client.ping.mockResolvedValue("PONG");
  });

  it("is true when Redis answers, and closes the connection", async () => {
    expect(await pingCache()).toBe(true);
    expect(client.destroy).toHaveBeenCalled();
  });

  it("is false when it cannot connect, and does not throw", async () => {
    client.connect.mockRejectedValue(new Error("refused"));
    expect(await pingCache()).toBe(false);
    expect(client.destroy).toHaveBeenCalled();
  });
});

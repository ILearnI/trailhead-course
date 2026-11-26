import { afterEach, describe, expect, it, vi } from "vitest";
import { corsHeaders } from "./cors";

const request = (origin) =>
  new Request("http://localhost/api", { headers: origin ? { origin } : {} });

afterEach(() => vi.unstubAllEnvs());

describe("corsHeaders", () => {
  it("gives nothing without an origin", () => {
    expect(corsHeaders(request())).toEqual({});
  });

  it("gives nothing to a stranger", () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://app.example");
    expect(corsHeaders(request("https://evil.example"))).toEqual({});
  });

  it("answers an allowed origin, and says that it varies", () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://app.example");
    const headers = corsHeaders(request("https://app.example"));
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://app.example");
    expect(headers.Vary).toBe("Origin");
  });
});

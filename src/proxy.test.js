// @vitest-environment node
import { NextRequest } from "next/server";
import {
  getRedirectUrl,
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { signToken } from "@/lib/session-token";
import { config, proxy } from "./proxy";

afterEach(() => vi.unstubAllEnvs());

// A request, with a session cookie
const ask = (path, token) =>
  new NextRequest(`http://localhost${path}`, {
    headers: token ? { cookie: `session=${token}` } : {},
  });

describe("the matcher", () => {
  const runs = (url, headers) => unstable_doesMiddlewareMatch({ config, url, headers });

  it("runs on pages", () => {
    expect(runs("/trails")).toBe(true);
    expect(runs("/account")).toBe(true);
  });

  it("skips the api, the static files, and the icon", () => {
    expect(runs("/api/trails")).toBe(false);
    expect(runs("/_next/static/chunks/app.js")).toBe(false);
    expect(runs("/favicon.ico")).toBe(false);
  });

  it("skips the prefetches of next/link", () => {
    expect(runs("/trails", { "next-router-prefetch": "1" })).toBe(false);
    expect(runs("/trails", { purpose: "prefetch" })).toBe(false);
  });
});

describe("redirects and rewrites", () => {
  it("redirects an old guide address for good", async () => {
    const response = await proxy(ask("/guide/getting-started"));
    expect(response.status).toBe(308);
    expect(getRedirectUrl(response)).toBe("http://localhost/guides/getting-started");
  });

  it("rewrites the friendly addresses of the api", async () => {
    const json = await proxy(ask("/trails.json"));
    expect(isRewrite(json)).toBe(true);
    expect(getRewrittenUrl(json)).toBe("http://localhost/api/trails");
    const v1 = await proxy(ask("/v1/trails"));
    expect(getRewrittenUrl(v1)).toBe("http://localhost/api/v1/trails");
  });

  it("does not rewrite a normal page", async () => {
    expect(isRewrite(await proxy(ask("/trails")))).toBe(false);
  });
});

describe("maintenance mode", () => {
  it("answers 503 with a delay, for every page", async () => {
    vi.stubEnv("MAINTENANCE", "on");
    const response = await proxy(ask("/trails"));
    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("300");
  });
});

describe("the session", () => {
  it("sends a visitor from a private page to the login", async () => {
    const response = await proxy(ask("/account"));
    expect(getRedirectUrl(response)).toBe("http://localhost/login?next=%2Faccount");
  });

  it("sends a visitor from the studio to the login", async () => {
    const response = await proxy(ask("/studio/trails"));
    expect(getRedirectUrl(response)).toBe("http://localhost/login?next=%2Fstudio%2Ftrails");
  });

  it("lets a signed in person through, with a CSP", async () => {
    const token = await signToken(1);
    const response = await proxy(ask("/account", token));
    expect(getRedirectUrl(response)).toBeNull();
    expect(response.headers.get("content-security-policy")).toMatch(/nonce-/);
  });

  it("sends a signed in person away from the login", async () => {
    const response = await proxy(ask("/login", await signToken(1)));
    expect(getRedirectUrl(response)).toBe("http://localhost/account");
  });

  it("ignores a forged cookie", async () => {
    const response = await proxy(ask("/account", "forged"));
    expect(getRedirectUrl(response)).toContain("/login");
  });
});

describe("the request id", () => {
  it("is on every answer, and different each time", async () => {
    const first = await proxy(ask("/trails"));
    const second = await proxy(ask("/trails"));
    const id = first.headers.get("x-request-id");
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(second.headers.get("x-request-id")).not.toBe(id);
  });
});

describe("the front door", () => {
  const door = (headers) =>
    proxy(new NextRequest("http://localhost/intl/trails", { headers }));

  it("sends a visitor to the language of the browser", async () => {
    const response = await door({ "accept-language": "fr-FR,fr;q=0.9" });
    expect(getRedirectUrl(response)).toBe("http://localhost/fr/trails");
  });

  it("prefers the cookie of a returning visitor", async () => {
    const response = await door({ cookie: "NEXT_LOCALE=es", "accept-language": "fr" });
    expect(getRedirectUrl(response)).toBe("http://localhost/es/trails");
  });
});

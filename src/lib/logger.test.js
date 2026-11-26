import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { log, redact } from "./logger";

describe("redact", () => {
  it("hides the values of secret fields", () => {
    const out = redact({ user: "ana", sessionToken: "abc", password: "x" });
    expect(out).toEqual({ user: "ana", sessionToken: "[hidden]", password: "[hidden]" });
  });
});

describe("log", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("writes one line of JSON, with the fields", () => {
    log.info("hello", { path: "/a" });
    const line = JSON.parse(console.log.mock.calls[0][0]);
    expect(line).toMatchObject({ level: "info", message: "hello", path: "/a" });
    expect(line.time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("sends errors to the error output", () => {
    log.error("broken");
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.log).not.toHaveBeenCalled();
  });

  it("skips what is below the level", () => {
    vi.stubEnv("LOG_LEVEL", "warn");
    log.info("quiet");
    expect(console.log).not.toHaveBeenCalled();
  });

  it("falls back to info for an unknown level", () => {
    vi.stubEnv("LOG_LEVEL", "loud");
    log.debug("skipped");
    log.info("written");
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});

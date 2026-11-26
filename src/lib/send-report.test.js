import { afterEach, describe, expect, it, vi } from "vitest";
import { sendReport } from "./send-report";

describe("sendReport", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends a beacon with the report", () => {
    const sendBeacon = vi.fn();
    vi.stubGlobal("navigator", { sendBeacon });
    sendReport(new Error("Boom"));
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon.mock.calls[0][0]).toBe("/api/errors");
    expect(sendBeacon.mock.calls[0][1]).toBeInstanceOf(Blob);
  });

  it("never throws", () => {
    vi.stubGlobal("navigator", {
      sendBeacon: () => {
        throw new Error("no beacon");
      },
    });
    expect(() => sendReport("x")).not.toThrow();
  });
});

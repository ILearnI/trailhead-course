import { afterEach, describe, expect, it, vi } from "vitest";
import { LogExporter } from "./log-exporter";

const span = {
  name: "reviews.list",
  duration: [0, 2_600_000],
  status: { code: 0 },
  parentSpanContext: { spanId: "bbbb" },
  spanContext: () => ({ traceId: "aaaa", spanId: "cccc" }),
};

describe("LogExporter", () => {
  afterEach(() => vi.restoreAllMocks());

  it("writes each span as a line of the log, then says it is done", () => {
    const write = vi.spyOn(console, "log").mockImplementation(() => {});
    const done = vi.fn();
    new LogExporter().export([span], done);
    const line = JSON.parse(write.mock.calls[0][0]);
    expect(line).toMatchObject({ message: "span", name: "reviews.list", ms: 3 });
    expect(done).toHaveBeenCalledWith({ code: 0 });
  });

  it("says when a span failed", () => {
    const write = vi.spyOn(console, "log").mockImplementation(() => {});
    new LogExporter().export([span, { ...span, status: { code: 2 } }], () => {});
    const failed = write.mock.calls.map((call) => JSON.parse(call[0]).failed);
    expect(failed).toEqual([false, true]);
  });

  it("can shut down", async () => {
    await expect(new LogExporter().shutdown()).resolves.toBeUndefined();
  });
});

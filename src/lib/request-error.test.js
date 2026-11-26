import { describe, expect, it } from "vitest";
import { describeError } from "./request-error";

describe("describeError", () => {
  it("gives the message and the fields to log", () => {
    const error = Object.assign(new Error("Flaky API: 500"), { digest: "123" });
    const request = { method: "GET", path: "/risky" };
    const context = { routePath: "/risky", routeType: "render" };
    expect(describeError(error, request, context)).toEqual({
      message: "Flaky API: 500",
      fields: {
        digest: "123",
        method: "GET",
        path: "/risky",
        route: "/risky",
        routeType: "render",
      },
    });
  });
});

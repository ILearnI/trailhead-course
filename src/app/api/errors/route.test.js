import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearReports, listReports } from "@/lib/error-report";
import { GET, POST } from "./route";

vi.mock("next/server", () => ({ connection: async () => {} }));

const post = (body, address = "1.1.1.1") =>
  POST(
    new Request("http://localhost/api/errors", {
      method: "POST",
      headers: { "x-forwarded-for": address },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

describe("POST /api/errors", () => {
  beforeEach(clearReports);

  it("stores a report as a client error, with a clean address", async () => {
    const body = { message: "Boom", url: "/trails?token=abc", kind: "server" };
    const response = await post(body);
    expect(response.status).toBe(204);
    expect(listReports()[0]).toMatchObject({ kind: "client", message: "Boom", url: "/trails" });
  });

  it("refuses what is not a report", async () => {
    expect((await post("not json")).status).toBe(400);
    expect((await post({ message: 5 })).status).toBe(400);
  });

  it("limits the reports of one visitor", async () => {
    for (let i = 0; i < 30; i += 1) await post({ message: "x" }, "2.2.2.2");
    expect((await post({ message: "x" }, "2.2.2.2")).status).toBe(429);
  });
});

describe("GET /api/errors", () => {
  beforeEach(clearReports);

  it("needs the secret", async () => {
    vi.stubEnv("ANALYTICS_SECRET", "s3cret");
    const response = await GET(new Request("http://localhost/api/errors"));
    expect(response.status).toBe(401);
  });

  it("lists the reports for the one who has it", async () => {
    vi.stubEnv("ANALYTICS_SECRET", "s3cret");
    await post({ message: "Boom" }, "3.3.3.3");
    const headers = { "x-analytics-secret": "s3cret" };
    const response = await GET(new Request("http://localhost/api/errors", { headers }));
    expect((await response.json())[0].message).toBe("Boom");
  });
});

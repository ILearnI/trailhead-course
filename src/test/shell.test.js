// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Needs a build: skipped when there is none
const manifest = ".next/prerender-manifest.json";
const built = existsSync(manifest);
const routes = built ? JSON.parse(readFileSync(manifest, "utf8")).routes : {};

describe.skipIf(!built)("the static shell", () => {
  it.each(["/", "/about", "/analytics"])("%s has a prerendered shell", (route) => {
    expect(routes[route]).toMatchObject({ response: "initial", compute: "resuming" });
    expect(routes[route].htmlSize).toBeGreaterThan(1000);
  });

  it("shows the cached cards, and a fallback for the live one", () => {
    const html = readFileSync(".next/server/app/analytics.html", "utf8");
    expect(html).toContain("Totals");
    expect(html).toContain("Newest trails");
    expect(html).toContain("Last 5 minutes</h2>...");
    // Live data never reaches the shell
    expect(html).not.toContain("new reviews");
  });
});

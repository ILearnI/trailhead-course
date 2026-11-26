import { describe, expect, it } from "vitest";
import { navFor } from "./studio-nav";

const labels = (role) => navFor({ role }).map((section) => section.label);

describe("navFor", () => {
  it("gives nothing to a visitor and a normal user", () => {
    expect(navFor(null)).toEqual([]);
    expect(labels("user")).toEqual([]);
  });

  it("gives an editor the content sections", () => {
    expect(labels("editor")).toEqual(["Overview", "Trails", "Reviews"]);
  });

  it("gives an admin everything", () => {
    expect(labels("admin")).toEqual(["Overview", "Trails", "Reviews", "People"]);
  });
});

import { describe, expect, it } from "vitest";
import { trailPrompt } from "./trail-prompt";

const trail = { name: "Cedar Falls", region: "coast", level: "Easy", km: 4.2 };

describe("trailPrompt", () => {
  it("gives the facts of the trail", () => {
    const prompt = trailPrompt(trail);
    expect(prompt).toContain("Name: Cedar Falls");
    expect(prompt).toContain("Length: 4.2 km");
  });

  it("adds the notes only when there are some", () => {
    expect(trailPrompt(trail)).not.toContain("Notes:");
    expect(trailPrompt({ ...trail, description: "A falls." })).toContain("Notes: A falls.");
  });
});

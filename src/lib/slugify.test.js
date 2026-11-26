import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("makes a slug from a name", () => {
    expect(slugify("Alpine Lake Loop")).toBe("alpine-lake-loop");
  });

  it("removes accents and symbols", () => {
    expect(slugify("  Col de la Croix-Haute! ")).toBe("col-de-la-croix-haute");
    expect(slugify("Château d'Eau")).toBe("chateau-d-eau");
  });

  it("can give nothing", () => {
    expect(slugify("!!!")).toBe("");
  });
});

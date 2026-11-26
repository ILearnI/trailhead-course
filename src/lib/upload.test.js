import { describe, expect, it } from "vitest";
import { MAX_SIZE, checkPhoto } from "./upload";

const photo = (type, size) => new File([new Uint8Array(size)], "p", { type });

describe("checkPhoto", () => {
  it("accepts a small jpeg", () => {
    expect(checkPhoto(photo("image/jpeg", 100))).toBeNull();
  });

  it("refuses what is not a file, or is empty", () => {
    expect(checkPhoto("nope")).toBe("missing");
    expect(checkPhoto(photo("image/png", 0))).toBe("missing");
  });

  it("refuses a type that we do not know", () => {
    expect(checkPhoto(photo("application/pdf", 100))).toBe("type");
  });

  it("refuses a file over the limit", () => {
    expect(checkPhoto(photo("image/webp", MAX_SIZE + 1))).toBe("size");
  });
});

import { describe, expect, it } from "vitest";
import { MAX_BYTES, photoProblem, sniffImage } from "./photo";

const pad = new Array(12).fill(0);
const bytes = (...numbers) => Uint8Array.from([...numbers, ...pad]);
const ascii = (text) => [...text].map((letter) => letter.charCodeAt(0));

describe("sniffImage", () => {
  it("knows the three formats", () => {
    expect(sniffImage(bytes(0xff, 0xd8, 0xff))).toBe("jpg");
    expect(sniffImage(bytes(0x89, ...ascii("PNG")))).toBe("png");
    const webp = [...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")];
    expect(sniffImage(Uint8Array.from(webp))).toBe("webp");
  });

  it("refuses a text, and a gif", () => {
    expect(sniffImage(bytes(...ascii("<script>")))).toBeNull();
    expect(sniffImage(bytes(...ascii("GIF89a")))).toBeNull();
  });
});

describe("photoProblem", () => {
  it("accepts an image", () => {
    expect(photoProblem(bytes(0xff, 0xd8, 0xff))).toBeNull();
  });

  it("explains what is wrong", () => {
    expect(photoProblem(bytes(...ascii("hello")))).toBe("Choose a JPEG, PNG or WebP image");
    const big = new Uint8Array(MAX_BYTES + 1);
    big.set([0xff, 0xd8, 0xff]);
    expect(photoProblem(big)).toBe("At most 2 MB");
  });
});

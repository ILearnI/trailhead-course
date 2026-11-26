// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Every file under a folder
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// The code that names tags
const sources = [
  ...walk("src/dal"),
  ...walk("src/app/api"),
  ...walk("src/app/(app)/explore"),
  ...walk("src/app/(app)/account"),
].filter((file) => file.endsWith(".js") && !file.endsWith(".test.js"));

describe("tag names", () => {
  it("never writes a tag as a text", () => {
    const literal = /(cacheTag|updateTag|revalidateTag)\(\s*["'`]/;
    const bad = sources.filter((file) => literal.test(readFileSync(file, "utf8")));
    expect(bad).toEqual([]);
  });
});

const writers = [
  "src/app/(app)/explore/actions.js",
  "src/app/(app)/account/reviews/actions.js",
  "src/app/api/trails/[slug]/reviews/route.js",
];

describe("writers of reviews", () => {
  it.each(writers)("%s ends the reviews and the ranking", (file) => {
    const code = readFileSync(file, "utf8");
    expect(code).toContain("tags.reviews(");
    expect(code).toContain("tags.ranking");
  });
});

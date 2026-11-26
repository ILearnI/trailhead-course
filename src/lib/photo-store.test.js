// @vitest-environment node
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { readPhoto, removePhoto, savePhoto } from "./photo-store";


const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAh" +
    "KmMIQAAAABJRU5ErkJggg==",
  "base64",
);
let folder;

beforeEach(() => {
  folder = mkdtempSync(path.join(tmpdir(), "photos-"));
  vi.stubEnv("UPLOAD_DIR", folder);
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(folder, { recursive: true, force: true });
});

describe("savePhoto", () => {
  it("saves an image under a name of our own", async () => {
    const result = await savePhoto(new File([PNG], "../../evil.png"));
    expect(result.ok).toBe(true);
    expect(result.name).toMatch(/^[a-f0-9-]{36}\.png$/);
    expect(await readPhoto(result.name)).toEqual(PNG);
  });

  it("refuses a text that is called photo.png", async () => {
    const result = await savePhoto(new File(["<script>"], "photo.png"));
    expect(result).toEqual({ ok: false, error: "Choose a JPEG, PNG or WebP image" });
  });
});

describe("readPhoto and removePhoto", () => {
  it("only reads the names that we made", async () => {
    expect(await readPhoto("../package.json")).toBeNull();
    expect(await readPhoto("photo.png")).toBeNull();
  });

  it("removes a photo", async () => {
    const { name } = await savePhoto(new File([PNG], "a.png"));
    await removePhoto(name);
    expect(existsSync(path.join(folder, name))).toBe(false);
    await removePhoto("not-ours");
  });
});

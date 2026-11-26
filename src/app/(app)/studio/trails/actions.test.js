import { beforeEach, describe, expect, it, vi } from "vitest";

const dal = vi.hoisted(() => ({
  createTrail: vi.fn(),
  updateTrail: vi.fn(),
  deleteTrail: vi.fn(),
}));
const cache = vi.hoisted(() => ({ updateTag: vi.fn() }));
const store = vi.hoisted(() => ({ savePhoto: vi.fn(), removePhoto: vi.fn() }));
vi.mock("@/dal/trail-writes", () => dal);
vi.mock("next/cache", () => cache);
vi.mock("@/lib/photo-store", () => store);
vi.mock("next/navigation", () => ({
  redirect: (url) => {
    throw new Error(`redirect ${url}`);
  },
}));

import { removeTrail, saveTrail } from "./actions";

const form = (fields) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};
const valid = {
  name: "Tarn Loop",
  region: "alps",
  level: "Easy",
  km: "4.5",
  description: "",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("saveTrail", () => {
  it("returns the messages and values when invalid", async () => {
    const state = await saveTrail({}, form({ ...valid, name: "ab" }));
    expect(state.errors.name).toEqual(["At least 3 letters"]);
    expect(state.values.name).toBe("ab");
    expect(dal.createTrail).not.toHaveBeenCalled();
  });

  it("creates, refreshes the tags, and goes back to the list", async () => {
    dal.createTrail.mockResolvedValue({ ok: true, slug: "tarn-loop" });
    const done = saveTrail({}, form(valid));
    await expect(done).rejects.toThrow("redirect /studio/trails");
    expect(dal.createTrail).toHaveBeenCalledWith(expect.objectContaining({ km: 4.5 }));
    expect(cache.updateTag).toHaveBeenCalledWith("trail:tarn-loop");
    expect(cache.updateTag).toHaveBeenCalledTimes(3);
  });

  it("updates when the form has a slug", async () => {
    dal.updateTrail.mockResolvedValue({ ok: true, slug: "tarn-loop" });
    const edit = form({ ...valid, slug: "tarn-loop" });
    await expect(saveTrail({}, edit)).rejects.toThrow("redirect");
    expect(dal.updateTrail).toHaveBeenCalledWith("tarn-loop", expect.any(Object));
    expect(dal.createTrail).not.toHaveBeenCalled();
  });

  it("shows the refusal of the data layer", async () => {
    const error = "A trail with this name exists";
    dal.createTrail.mockResolvedValue({ ok: false, error });
    const state = await saveTrail({}, form(valid));
    expect(state.errors.name).toEqual(["A trail with this name exists"]);
    expect(cache.updateTag).not.toHaveBeenCalled();
  });

  it("shows the problem of a photo, and writes nothing", async () => {
    store.savePhoto.mockResolvedValue({ ok: false, error: "At most 2 MB" });
    const upload = new File(["x"], "big.png");
    const state = await saveTrail({}, form({ ...valid, photo: upload }));
    expect(state.errors.photo).toEqual(["At most 2 MB"]);
    expect(dal.createTrail).not.toHaveBeenCalled();
  });

  it("stores the name of a good photo, and removes the old one", async () => {
    store.savePhoto.mockResolvedValue({ ok: true, name: "new.png" });
    const answer = { ok: true, slug: "tarn-loop", replaced: "old.png" };
    dal.updateTrail.mockResolvedValue(answer);
    const file = new File(["x"], "a.png");
    const sent = form({ ...valid, slug: "tarn-loop", photo: file });
    await expect(saveTrail({}, sent)).rejects.toThrow("redirect");
    const withPhoto = expect.objectContaining({ photo: "new.png" });
    expect(dal.updateTrail).toHaveBeenCalledWith("tarn-loop", withPhoto);
    expect(store.removePhoto).toHaveBeenCalledWith("old.png");
  });
});

describe("removeTrail", () => {
  it("does nothing without the confirmation", async () => {
    const state = await removeTrail({}, form({ slug: "tarn-loop" }));
    expect(state.error).toBe("Tick the box to confirm");
    expect(dal.deleteTrail).not.toHaveBeenCalled();
  });

  it("deletes with the confirmation, and goes back to the list", async () => {
    dal.deleteTrail.mockResolvedValue({ ok: true });
    const sent = form({ slug: "tarn-loop", confirm: "yes" });
    await expect(removeTrail({}, sent)).rejects.toThrow("redirect /studio/trails");
    expect(cache.updateTag).toHaveBeenCalledWith("trails");
  });
});

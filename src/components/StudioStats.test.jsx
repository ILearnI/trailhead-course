import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const state = vi.hoisted(() => ({ stats: null }));
vi.mock("@/dal/studio-stats", () => ({ getStudioStats: async () => state.stats }));

import StudioStats from "./StudioStats";

const stats = {
  trails: 7,
  reviews: 12,
  average: 4.26,
  lastWeek: 3,
  unreviewed: 2,
  top: [{ slug: "a", name: "Alpha", reviews: 5, average: 4.4 }],
  at: "10:15:00",
};

describe("StudioStats", () => {
  it("shows the numbers on cards", async () => {
    state.stats = stats;
    render(await StudioStats());
    const reviews = screen.getByRole("region", { name: "Reviews", exact: true });
    expect(reviews).toHaveTextContent("12");
    expect(screen.getByRole("region", { name: "Average rating" })).toHaveTextContent("4.3");
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Numbers of 10:15:00 UTC")).toBeInTheDocument();
  });

  it("shows a dash when nothing was rated", async () => {
    state.stats = { ...stats, reviews: 0, average: null, top: [] };
    render(await StudioStats());
    expect(screen.getByRole("region", { name: "Average rating" })).toHaveTextContent("–");
  });
});

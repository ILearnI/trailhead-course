import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Forecast from "./Forecast";

// The real module has a secret, server only
vi.mock("@/lib/weather", () => ({
  getForecast: vi.fn().mockResolvedValue({ summary: "Rain at noon", key: "test" }),
}));

describe("Forecast", () => {
  it("shows the summary of the forecast", async () => {
    render(await Forecast());
    expect(screen.getByText(/Rain at noon/)).toBeInTheDocument();
  });
});

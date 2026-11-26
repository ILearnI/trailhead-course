import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import TrailWeather from "./TrailWeather";

// The cache functions need a real request: fake them
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

describe("TrailWeather", () => {
  it("shows the forecast of the region", async () => {
    render(await TrailWeather({ region: "alps" }));
    const text = "Forecast for the alps: Snow showers, 2 °C";
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("shows a fallback when the service answers an error", async () => {
    server.use(
      http.get("http://localhost:4002/weather", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    render(await TrailWeather({ region: "coast" }));
    expect(screen.getByText("Forecast unavailable.")).toBeInTheDocument();
  });

  it("shows a fallback when the network is down", async () => {
    server.use(http.get("http://localhost:4002/weather", () => HttpResponse.error()));
    render(await TrailWeather({ region: "forest" }));
    expect(screen.getByText("Forecast unavailable.")).toBeInTheDocument();
  });
});

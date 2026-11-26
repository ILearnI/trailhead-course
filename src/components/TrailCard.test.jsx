import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FavoritesProvider } from "./FavoritesProvider";
import TrailCard from "./TrailCard";

const trail = { slug: "cedar-falls", name: "Cedar Falls", km: 4.2, level: "Easy" };

describe("TrailCard", () => {
  it("links to the trail page", () => {
    render(
      <FavoritesProvider>
        <TrailCard trail={trail} />
      </FavoritesProvider>,
    );
    const link = screen.getByRole("link", { name: "Cedar Falls" });
    expect(link).toHaveAttribute("href", "/trails/cedar-falls");
  });

  it("shows the level and the distance", () => {
    render(
      <FavoritesProvider>
        <TrailCard trail={trail} />
      </FavoritesProvider>,
    );
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("4.2 km")).toBeInTheDocument();
  });

  it("shows how long the walk takes", () => {
    render(
      <FavoritesProvider>
        <TrailCard trail={trail} />
      </FavoritesProvider>,
    );
    expect(screen.getByText("About 1 h 5 min")).toBeInTheDocument();
  });
});

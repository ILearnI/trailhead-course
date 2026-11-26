import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StudioNavLinks from "./StudioNavLinks";

const state = vi.hoisted(() => ({ path: "/studio" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.path }));

const items = [
  { href: "/studio", label: "Overview" },
  { href: "/studio/trails", label: "Trails" },
];

describe("StudioNavLinks", () => {
  beforeEach(() => {
    state.path = "/studio";
  });

  it("marks the page that is open", () => {
    render(<StudioNavLinks items={items} />);
    const overview = screen.getByRole("link", { name: "Overview" });
    const trails = screen.getByRole("link", { name: "Trails" });
    expect(overview).toHaveAttribute("aria-current", "page");
    expect(trails).not.toHaveAttribute("aria-current");
  });

  it("keeps a section current on its sub pages", () => {
    state.path = "/studio/trails/new";
    render(<StudioNavLinks items={items} />);
    const overview = screen.getByRole("link", { name: "Overview" });
    const trails = screen.getByRole("link", { name: "Trails" });
    expect(trails).toHaveAttribute("aria-current", "page");
    expect(overview).not.toHaveAttribute("aria-current");
  });
});

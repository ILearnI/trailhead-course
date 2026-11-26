import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

// Replace the module before NavLink loads it
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

describe("NavLink", () => {
  it("marks the current page", () => {
    usePathname.mockReturnValue("/trails");
    render(<NavLink href="/trails">Trails</NavLink>);
    const link = screen.getByRole("link", { name: "Trails" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("is not active on another page", () => {
    usePathname.mockReturnValue("/about");
    render(<NavLink href="/trails">Trails</NavLink>);
    const link = screen.getByRole("link", { name: "Trails" });
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("stays active on a child page", () => {
    usePathname.mockReturnValue("/trails/cedar-falls");
    render(<NavLink href="/trails">Trails</NavLink>);
    const link = screen.getByRole("link", { name: "Trails" });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});

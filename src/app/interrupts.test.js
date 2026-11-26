import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Forbidden from "./forbidden";
import Unauthorized from "./unauthorized";

describe("the forbidden page", () => {
  it("says 403, and offers a way back", () => {
    render(<Forbidden />);
    expect(screen.getByRole("heading", { name: /403/ })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /back to your account/i });
    expect(link).toHaveAttribute("href", "/account");
  });
});

describe("the unauthorized page", () => {
  it("says 401, and offers the login", () => {
    render(<Unauthorized />);
    expect(screen.getByRole("heading", { name: /401/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
  });
});

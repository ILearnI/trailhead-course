import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter", () => {
  it("starts at zero", () => {
    render(<Counter />);
    expect(screen.getByRole("button")).toHaveTextContent("Saved trails: 0");
  });

  it("counts the clicks", async () => {
    const user = userEvent.setup();
    render(<Counter label="Likes" />);
    const button = screen.getByRole("button", { name: /likes/i });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveTextContent("Likes: 2");
  });
});

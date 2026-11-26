import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesProvider } from "./FavoritesProvider";
import FavoriteButton from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("toggles the saved state", async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <FavoriteButton slug="cedar-falls" name="Cedar Falls" />
      </FavoritesProvider>,
    );
    const button = screen.getByRole("button", { name: "Save Cedar Falls" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

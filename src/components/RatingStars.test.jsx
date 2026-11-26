import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RatingStars from "./RatingStars";

describe("RatingStars", () => {
  it("shows no rating at first", () => {
    render(<RatingStars />);
    expect(screen.queryByText(/you rated/i)).not.toBeInTheDocument();
  });

  it("shows the rating after a click", async () => {
    const user = userEvent.setup();
    render(<RatingStars />);
    await user.click(screen.getByRole("button", { name: "4 stars" }));
    expect(screen.getByText("You rated 4 out of 5")).toBeInTheDocument();
  });
});

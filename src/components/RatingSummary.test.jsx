import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import RatingSummary from "./RatingSummary";

const reviews = [{ rating: 4 }, { rating: 3 }];

describe("RatingSummary", () => {
  it("says the average and the count", () => {
    render(<RatingSummary reviews={reviews} />);
    expect(screen.getByText("Rated 3.5 out of 5, from 2 reviews")).toBeInTheDocument();
  });

  it("has a line for each number of stars", () => {
    render(<RatingSummary reviews={reviews} />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(5);
    expect(within(rows[1]).getByText("4 stars")).toBeInTheDocument();
    expect(within(rows[1]).getByText("1")).toBeInTheDocument();
  });

  it("shows no bars when there is no review", () => {
    render(<RatingSummary reviews={[]} />);
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

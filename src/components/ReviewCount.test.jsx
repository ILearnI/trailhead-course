import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewCount from "./ReviewCount";

describe("ReviewCount", () => {
  it("counts the reviews of a trail", async () => {
    render(await ReviewCount({ slug: "alpine-lake" }));
    expect(screen.getByText("2 reviews")).toBeInTheDocument();
  });

  it("shows zero for a trail without reviews", async () => {
    render(await ReviewCount({ slug: "granite-peak" }));
    expect(screen.getByText("0 reviews")).toBeInTheDocument();
  });
});

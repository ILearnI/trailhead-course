import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrailPhoto from "./TrailPhoto";

describe("TrailPhoto", () => {
  it("renders the photo of the trail", () => {
    const trail = { slug: "cedar-falls", name: "Cedar Falls" };
    render(<TrailPhoto trail={trail} />);
    const photo = screen.getByRole("img", { name: "Cedar Falls" });
    const src = decodeURIComponent(photo.getAttribute("src"));
    expect(src).toContain("/trails/cedar-falls.jpg");
  });
});

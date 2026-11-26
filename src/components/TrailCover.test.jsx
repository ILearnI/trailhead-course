import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TrailCover from "./TrailCover";

describe("TrailCover", () => {
  it("shows the photo with a description", () => {
    render(<TrailCover trail={{ name: "Tarn Loop", photo: "a.png" }} />);
    expect(screen.getByAltText("Photo of Tarn Loop")).toBeInTheDocument();
  });

  it("shows nothing without a photo", () => {
    const { container } = render(<TrailCover trail={{ name: "Tarn Loop", photo: null }} />);
    expect(container).toBeEmptyDOMElement();
  });
});

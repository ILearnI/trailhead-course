import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import BackButton from "./BackButton";

vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));

describe("BackButton", () => {
  it("asks the router to go back", async () => {
    const back = vi.fn();
    useRouter.mockReturnValue({ back });
    render(<BackButton />);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(back).toHaveBeenCalledTimes(1);
  });
});

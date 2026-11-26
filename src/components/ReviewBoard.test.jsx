import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/components/ToastProvider";
import { addReview } from "@/app/actions";
import ReviewBoard from "./ReviewBoard";

// Replace the real action with a fake
vi.mock("@/app/actions", () => ({ addReview: vi.fn() }));

const reviews = [
  { trail: "alpine-lake", name: "A hiker", rating: 4, text: "Busy at the weekend." },
];

// The board, inside the toast provider
function renderBoard() {
  render(
    <ToastProvider>
      <ReviewBoard slug="alpine-lake" reviews={reviews} />
    </ToastProvider>,
  );
}

const defaults = {
  name: "Ada",
  rating: "5",
  text: "Clear water, easy to follow.",
};

// Fill the form, and press the button
async function submitReview(user, changes = {}) {
  const values = { ...defaults, ...changes };
  await user.type(screen.getByPlaceholderText("Your name"), values.name);
  await user.type(screen.getByPlaceholderText("Rating, 1 to 5"), values.rating);
  await user.type(screen.getByPlaceholderText("Your review"), values.text);
  await user.click(screen.getByRole("button", { name: "Add review" }));
}

afterEach(() => vi.clearAllMocks());

describe("ReviewBoard", () => {
  it("shows the reviews and the form", () => {
    renderBoard();
    expect(screen.getByText("A hiker: 4/5, Busy at the weekend.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add review" })).toBeInTheDocument();
  });

  it("sends the form data to the action", async () => {
    addReview.mockResolvedValue({ errors: {}, values: {}, ok: true });
    renderBoard();
    await submitReview(userEvent.setup());
    const formData = addReview.mock.calls[0][1];
    expect(formData.get("trail")).toBe("alpine-lake");
    expect(formData.get("name")).toBe("Ada");
  });

  it("shows the errors that the action returns", async () => {
    addReview.mockResolvedValue({
      errors: { name: ["Enter your name"] },
      values: { name: "A" },
    });
    renderBoard();
    await submitReview(userEvent.setup(), { name: "A" });
    expect(await screen.findByText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toHaveValue("A");
  });

  it("shows pending and the optimistic review, then a toast", async () => {
    let finish;
    addReview.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    renderBoard();
    await submitReview(userEvent.setup());
    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
    expect(screen.getByText("Ada: 5/5, Clear water, easy to follow.")).toBeInTheDocument();
    await act(async () => finish({ errors: {}, values: {}, ok: true }));
    expect(await screen.findByText("Review added")).toBeInTheDocument();
  });

  it("shows an error toast when the save fails", async () => {
    addReview.mockResolvedValue({ errors: {}, values: {}, failed: true });
    renderBoard();
    await submitReview(userEvent.setup());
    expect(await screen.findByText("Could not save your review")).toBeInTheDocument();
  });
});

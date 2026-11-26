export class ReviewsPage {
  constructor(page) {
    this.page = page;
    const form = page.locator("#review-form");
    this.name = form.getByPlaceholder("Your name");
    this.rating = form.getByPlaceholder("Rating, 1 to 5");
    this.text = form.getByPlaceholder("Your review");
    this.submit = form.getByRole("button", { name: "Add review" });
    this.confirmation = page.getByText("Review added");
  }

  async goto(slug) {
    await this.page.goto(`/trails/${slug}/reviews`);
  }

  async addReview({ name, rating, text }) {
    await this.name.fill(name);
    await this.rating.fill(String(rating));
    await this.text.fill(text);
    await this.submit.click();
  }

  // A review in the list, found by its text
  item(text) {
    return this.page.getByRole("listitem").filter({ hasText: text });
  }
}

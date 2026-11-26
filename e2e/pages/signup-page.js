export class SignupPage {
  constructor(page) {
    this.page = page;
    this.name = page.getByRole("textbox", { name: "Your name" });
    this.email = page.getByRole("textbox", { name: "Email" });
    this.password = page.getByRole("textbox", { name: /Password/ });
    this.submit = page.getByRole("button", { name: "Create account" });
  }

  async goto() {
    await this.page.goto("/signup");
  }

  async signUp(user) {
    await this.goto();
    await this.name.fill(user.name);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submit.click();
    await this.page.waitForURL(/signup\/done/);
  }
}

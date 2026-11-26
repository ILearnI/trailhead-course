export class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByLabel("Email");
    this.password = page.getByLabel("Password");
    this.submit = page.getByRole("button", { name: "Log in" });
    // Next.js has its own alert: use the form
    this.error = page.locator("#login-form").getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async logIn(user) {
    await this.goto();
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}

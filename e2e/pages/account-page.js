export class AccountPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Your account" });
    this.logoutButton = page.getByRole("button", { name: "Log out" });
  }

  async goto() {
    await this.page.goto("/account");
  }

  signedInAs(name) {
    return this.page.getByText(`Signed in as ${name}`);
  }

  async logOut() {
    await this.logoutButton.click();
  }
}

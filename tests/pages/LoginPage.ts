import { Page, expect } from "@playwright/test";
import { UserData, UserInvalidData } from "../../Fixtures/userData";

export class LoginPage {
  page: Page;
  email;
  password;
  loginBtn;

  constructor(page: Page) {
    this.page = page;

    this.email = this.page.locator("#email");
    this.password = this.page.locator("#password");
    this.loginBtn = this.page.locator(".action.login.primary");
  }

  async login(userData: UserData | UserInvalidData) {
    await this.email.waitFor({ state: "visible" });
    await this.email.fill(userData.email);
    await this.password.fill(userData.password);
    await this.loginBtn.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/customer/);
  }
}

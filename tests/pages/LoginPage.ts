import { Page, expect } from "@playwright/test";

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

  async goto(baseURL: string) {
    await this.page.goto(`${baseURL}/customer/account/login/`);
  }

  async login(userData: any) {
    await this.email.fill(userData.email);
    await this.password.fill(userData.password);
    await this.loginBtn.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/account/);
  }
}
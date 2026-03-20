import { Page, expect } from "@playwright/test";
import { UserData, UserInvalidData } from "../../Fixtures/userData";

export class RegisterPage {
  page: Page;
  firstName;
  lastName;
  email;
  password;
  confirmPassword;
  submitBtn;

  constructor(page: Page) {
    this.page = page;

    this.firstName = this.page.locator('input[name="firstname"]');
    this.lastName = this.page.locator('input[name="lastname"]');
    this.email = this.page.locator('input[name="email"]');
    this.password = this.page.locator('#password');
    this.confirmPassword = this.page.locator('input[name="password_confirmation"]');
    this.submitBtn = this.page.locator('.action.submit.primary');
  }

  async goto(baseURL: string) {
    await this.page.goto(`${baseURL}/customer/account/create/`);
  }

  async register(userData: UserData | UserInvalidData) {
    await this.firstName.fill(userData.firstName);
    await this.lastName.fill(userData.lastName);
    await this.email.fill(userData.email);
    await this.password.fill(userData.password);
    await this.confirmPassword.fill(userData.password);
  }

  async assertValues(userData: UserData | UserInvalidData) {
    await expect(this.firstName).toHaveValue(userData.firstName);
    await expect(this.lastName).toHaveValue(userData.lastName);
    await expect(this.email).toHaveValue(userData.email);
  }

  async submit() {
    await this.submitBtn.click();
  }
}
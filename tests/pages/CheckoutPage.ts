import { expect, Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private page: Page) {}

  get homeMegaMenu() {
    return this.page.locator("#homeMegaMenu");
  }

  get firstNavLink() {
    return this.page
      .locator(".nav-link.u-header__sub-menu-nav-link.transition-3d-hover")
      .first();
  }

  get addToCartButton() {
    return this.page.locator("#extension-fbt-add-cart-desktop");
  }

  get shoppingCartDropdownInvoker() {
    return this.page.locator("#shoppingCartDropdownInvoker");
  }

  get topCartCheckoutButton() {
    return this.page.locator(".top-cart-checkout.float-right");
  }

  get loginModal() {
    return this.page.locator(".modal-popup:visible");
  }

  get closeModalButton() {
    return this.loginModal.locator('button[data-role="closeBtn"]').first();
  }

  get modalOverlay() {
    return this.page.locator(".modals-overlay");
  }

  get email() {
    return this.page.locator("#customer-email");
  }

  get name() {
    return this.page.locator('#billing input[name="firstname"]');
  }

  get surname() {
    return this.page.locator('#billing input[name="lastname"]');
  }

  get street1() {
    return this.page.locator('#billing input[name="street[0]"]');
  }

  get city() {
    return this.page.locator('#billing input[name="city"]');
  }

  get country() {
    return this.page.locator('#billing select[name="country_id"]');
  }

  get company() {
    return this.page.locator('#billing input[name="company"]');
  }

  get vat() {
    return this.page.locator('#billing input[name="vat_id"]');
  }

  get password() {
    return this.page.locator("#osc-password");
  }

  get confirmPassword() {
    return this.page.locator("#osc-password-confirmation");
  }

  get placeOrderButton() {
    return this.page.getByRole("button", { name: /place order/i });
  }

  get qty() {
    return this.page.locator(".item_qty.quantity");
  }

  get prices() {
    return this.page.locator(".price");
  }

  get plusButton() {
    return this.page.locator(".action-show.plus").first();
  }

  get customerEmailError() {
    return this.page.locator("#customer-email-error");
  }

  get oscPasswordError() {
    return this.page.locator("#osc-password-error");
  }

  get oscPasswordConfirmationError() {
    return this.page.locator("#osc-password-confirmation-error");
  }

  async openProductFromMenu(baseUrl: string) {
    await this.page.goto(`${baseUrl}/customer/account/login`, {});
    await this.homeMegaMenu.waitFor({ state: "visible" });
    await this.homeMegaMenu.hover();
    await this.firstNavLink.click();
  }

  async addItemToCartAndOpenCheckout() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click({ force: true });
    await this.shoppingCartDropdownInvoker.click();
    await this.topCartCheckoutButton.click();
  }

  async closeLoginModal() {
    await expect(this.loginModal).toBeVisible({ timeout: 10000 });
    await this.closeModalButton.click();
    await expect(this.loginModal).toBeHidden({ timeout: 10000 });
    await this.modalOverlay.waitFor({ state: "hidden" });
  }

  async fillBillingForm(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    await this.email.fill(userData.email);
    await this.name.fill(userData.firstName);
    await this.surname.fill(userData.lastName);
    await this.street1.fill("123 Main Street");
    await this.city.fill("New York");
    await this.country.selectOption("US");
    await this.company.fill("Mageplaza");
    await this.vat.fill("123456789");
    await this.password.fill(userData.password);
    await this.confirmPassword.fill(userData.password);
  }

  async expectBillingFormValues(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    await expect(this.email).toHaveValue(userData.email);
    await expect(this.name).toHaveValue(userData.firstName);
    await expect(this.surname).toHaveValue(userData.lastName);
    await expect(this.street1).toHaveValue("123 Main Street");
    await expect(this.city).toHaveValue("New York");
    await expect(this.country).toHaveValue("US");
    await expect(this.password).toHaveValue(userData.password);
    await expect(this.confirmPassword).toHaveValue(userData.password);
  }

  async clickPlaceOrder() {
    await expect(this.placeOrderButton).toBeVisible();
    await this.modalOverlay.waitFor({ state: "hidden" });
    await this.placeOrderButton.click({ force: true });
  }

  async expectPaypalRedirect() {
    await expect(this.page).toHaveURL(/paypal\.com\/cgi-bin\/webscr/i, {
      timeout: 20000,
    });
    await expect(this.page).toHaveURL(/cmd=_express-checkout/i);
    await expect(this.page).toHaveURL(/token=EC-/i);
  }

  async getQtyValue() {
    return Number(await this.qty.inputValue());
  }

  async getPricesText() {
    return this.prices.allInnerTexts();
  }

  async expectRequiredFieldErrors() {
    await expect(this.customerEmailError).toHaveText(
      "This is a required field.",
    );
    await expect(this.oscPasswordError).toHaveText("This is a required field.");
    await expect(this.oscPasswordConfirmationError).toHaveText(
      "This is a required field.",
    );
  }
}

import { test, expect } from "@playwright/test";
import { userData } from "../Fixtures/userData";
import { userInvalidData } from "../Fixtures/userData";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

const BASE_URL = process.env.BASE_URL || "https://dashboard.mageplaza.com";

// Verify user can register with all valid data
test("Register with valid data", async ({ page }) => {
  const register = new RegisterPage(page);
  await register.goto(BASE_URL);
  await register.register(userData);
  await register.assertValues(userData);
  await register.submit();
  await expect(page.locator("form#form-validate")).toBeVisible();
});

// Verify system prevents registration with invalid email
test("Register with invalid data", async ({ page }) => {
  const register = new RegisterPage(page);
  await register.goto(BASE_URL);

  await register.firstName.fill(userInvalidData.firstName);
  await register.lastName.fill(userInvalidData.lastName);
  await register.email.fill(userInvalidData.email);
  await register.password.fill(userInvalidData.password);
  await register.confirmPassword.fill(userInvalidData.confirmPassword);
  await register.submit();

  await expect(page.locator("#email_address-error")).toHaveText(/valid email/i);
});

// Verify user can log in with valid email and password
test("Login with valid data", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto(BASE_URL);
  await login.login(userData);
  await login.assertLoginSuccess();
});

// Verify system prevents login with invalid password
test("Login with invalid password", async ({ request }) => {
  const response = await request.post(
    `${BASE_URL}/rest/V1/integration/customer/token`,
    {
      data: { username: userData.email, password: "wrong!" },
    },
  );
  expect(response.status()).toBe(401);
});

// Verify user can complete checkout with valid billing information
test.only("User can complete checkout with valid billing information", async ({
  page,
  context,
}) => {
  await page.goto(`${BASE_URL}/customer/account/login/`, {});

  await page.locator("#homeMegaMenu").hover();
  await page
    .locator(".nav-link.u-header__sub-menu-nav-link.transition-3d-hover")
    .first()
    .click();

  const newPage = await context.waitForEvent("page");
  await newPage.waitForLoadState();

  await page.close();

  const addToCartButton = newPage.locator("#extension-fbt-add-cart-desktop");
  await expect(addToCartButton).toBeVisible();

  await addToCartButton.click({ force: true });
  await newPage.locator("#shoppingCartDropdownInvoker").click();
  await newPage.locator(".top-cart-checkout.float-right").click();

  await newPage.goto(`${BASE_URL}/onestepcheckout/index/index/`);

  const checkoutFrame = newPage.frameLocator("iframe");

  const name = checkoutFrame.locator('#billing input[name="firstname"]');
  const surname = checkoutFrame.locator('#billing input[name="lastname"]');
  const street1 = checkoutFrame.locator('#billing input[name="street[0]"]');
  const city = checkoutFrame.locator('#billing input[name="city"]');
  const country = checkoutFrame.locator('#billing select[name="country_id"]');
  const company = checkoutFrame.locator('#billing input[name="company"]');
  const vat = checkoutFrame.locator('#billing input[name="vat_id"]');

  await newPage.locator(".action-close").click();

  await name.fill(userData.firstName);
  await surname.fill(userData.lastName);
  await street1.fill("123 Main Street");
  await city.fill("New York");
  await country.selectOption("US");
  await company.fill("Mageplaza");
  await vat.fill("123456789");

  await expect(name).toHaveValue(userData.firstName);
  await expect(surname).toHaveValue(userData.lastName);
  await expect(street1).toHaveValue("123 Main Street");
  await expect(city).toHaveValue("New York");
  await expect(country).toHaveValue("US");

  const placeOrderButton = checkoutFrame.getByRole("button", {
    name: /place order/i,
  });
  await expect(placeOrderButton).toBeVisible();
  await placeOrderButton.click();
});

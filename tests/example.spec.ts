import { test, expect } from "@playwright/test";
import { userData } from "../Fixtures/userData";

const BASE_URL = process.env.BASE_URL || "https://dashboard.mageplaza.com";

// Verify user can register with all valid data
test("Register with valid data", async ({ page }) => {
  await page.goto(`${BASE_URL}/customer/account/create/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator('input[name="firstname"]').fill(userData.firstName);
  await page.locator('input[name="lastname"]').fill(userData.lastName);
  await page.locator('input[name="email"]').fill(userData.email);
  await page.locator('#password').fill(userData.password);
  await page.locator('input[name="password_confirmation"]').fill(userData.password);

  await expect(page.locator('input[name="firstname"]')).toHaveValue(userData.firstName);
  await expect(page.locator('input[name="lastname"]')).toHaveValue(userData.lastName);
  await expect(page.locator('input[name="email"]')).toHaveValue(userData.email);
  await expect(page.locator('#password')).toHaveValue(userData.password);
  await expect(page.locator('input[name="password_confirmation"]')).toHaveValue(userData.password);

  await page.locator('.action.submit.primary').click();
  await expect(page.locator('form#form-validate')).toBeVisible();
});

// Verify system prevents registration with invalid email
test("Register with invalid data", async ({ page }) => {
  await page.goto(`${BASE_URL}/customer/account/create/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator('input[name="firstname"]').fill(userData.firstName);
  await page.locator('input[name="lastname"]').fill("");
  await page.locator('input[name="email"]').fill("test.com");
  await page.locator("#password").fill(userData.password);
  await page.locator('input[name="password_confirmation"]').fill("otherPassword!");

  await expect(page.locator('input[name="firstname"]')).toHaveValue(userData.firstName);
  await expect(page.locator('input[name="lastname"]')).toHaveValue("");
  await expect(page.locator('input[name="email"]')).toHaveValue("test.com");
  await expect(page.locator("#password")).toHaveValue(userData.password);
  await expect(page.locator('input[name="password_confirmation"]')).toHaveValue("otherPassword!");

  await page.locator(".action.submit.primary").click();

  await expect(page.locator("#lastname-error")).toHaveText("This is a required field.");
  await expect(page.locator("#email_address-error")).toHaveText(/valid email/i);
  await expect(page.locator("#password-confirmation-error")).toHaveText(
    "Please enter the same value again."
  );
});

// Verify user can log in with valid email and password
test("Login with valid data", async ({ page }) => {
  await page.goto(`${BASE_URL}/customer/account/login/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator("#email").fill(userData.email);
  await page.locator("#password").fill(userData.password);

  await expect(page.locator("#email")).toHaveValue(userData.email);
  await expect(page.locator("#password")).toHaveValue(userData.password);

  await page.locator(".action.login.primary").click();
  await expect(page).toHaveURL(/account/);
});

// Verify system prevents login with invalid password
test("Login with invalid password", async ({ request }) => {
  const response = await request.post(`${BASE_URL}/rest/V1/integration/customer/token`, {
    data: {
      username: userData.email,
      password: "wrong!",
    },
  });
  expect(response.status()).toBe(401);
});

// Verify user can complete checkout with valid billing information
test.only("User can complete checkout with valid billing information", async ({ page, context }) => {
  await page.goto(`${BASE_URL}/customer/account/login/`, {});
 
  await page.locator('#homeMegaMenu').hover();
  await page.locator('.nav-link.u-header__sub-menu-nav-link.transition-3d-hover').first().click();
 
  const newPage = await context.waitForEvent('page');
  await newPage.waitForLoadState();
 
  await page.close();
 
  const addToCartButton = newPage.locator("#extension-fbt-add-cart-desktop");
  await expect(addToCartButton).toBeVisible();
 
  await addToCartButton.click({ force: true });
  await newPage.locator('#shoppingCartDropdownInvoker').click();
  await newPage.locator('.top-cart-checkout.float-right').click();

  await newPage.goto(`${BASE_URL}/onestepcheckout/index/index/`);

  const checkoutFrame = newPage.frameLocator("iframe");

  const name = checkoutFrame.locator('#billing input[name="firstname"]');
  const surname = checkoutFrame.locator('#billing input[name="lastname"]');
  const street1 = checkoutFrame.locator('#billing input[name="street[0]"]');
  const city = checkoutFrame.locator('#billing input[name="city"]');
  const country = checkoutFrame.locator('#billing select[name="country_id"]');
  const company = checkoutFrame.locator('#billing input[name="company"]');
  const vat = checkoutFrame.locator('#billing input[name="vat_id"]');

  await newPage.locator('.action-close').click()
  
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

  const placeOrderButton = checkoutFrame.getByRole("button", { name: /place order/i });
  await expect(placeOrderButton).toBeVisible();
  await placeOrderButton.click();
});
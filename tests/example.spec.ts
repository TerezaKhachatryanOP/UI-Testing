import { test, expect } from "@playwright/test";
import { userData } from "../Fixtures/userData";
import { userInvalidData } from "../Fixtures/userData";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { CheckoutPage } from "./pages/CheckotPage";

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
test("User can complete checkout with valid billing information", async ({
  page,
  context,
}) => {
  const checkout = new CheckoutPage(page);

  const newPagePromise = context.waitForEvent("page");
  await checkout.openProductFromMenu(BASE_URL);

  const newPage = await newPagePromise;
  await newPage.waitForLoadState();

  await page.close();

  const newCheckout = new CheckoutPage(newPage);

  await newCheckout.addItemToCartAndOpenCheckout();
  await newCheckout.closeLoginModal();
  await newCheckout.fillBillingForm(userData);
  await newCheckout.expectBillingFormValues(userData);
  await newCheckout.clickPlaceOrder();
  await newCheckout.expectPaypalRedirect();
});

// Verify user can increase item quantity and subtotal updates correctly
test("User can increase item quantity", async ({ page, context }) => {
  const checkout = new CheckoutPage(page);

  const newPagePromise = context.waitForEvent("page");
  await checkout.openProductFromMenu(BASE_URL);

  const newPage = await newPagePromise;
  await newPage.waitForLoadState();

  await page.close();

  const newCheckout = new CheckoutPage(newPage);

  await newCheckout.addItemToCartAndOpenCheckout();
  await newCheckout.closeLoginModal();

  const value = Number(await newCheckout.qty.inputValue());
  const before = await newCheckout.getPricesText();

  await newCheckout.plusButton.click();

  await expect(newCheckout.qty).toHaveValue(String(value + 1));
  await expect(async () => {
    const after = await newCheckout.getPricesText();
    expect(after).not.toEqual(before);
  }).toPass();
});

// Verify system prevents checkout when all required billing fields are empty
test("System prevents checkout when all required billing fields are empty", async ({
  page,
  context,
}) => {
  const checkout = new CheckoutPage(page);

  const newPagePromise = context.waitForEvent("page");
  await checkout.openProductFromMenu(BASE_URL);

  const newPage = await newPagePromise;
  await newPage.waitForLoadState();

  await page.close();

  const newCheckout = new CheckoutPage(newPage);

  await newCheckout.addItemToCartAndOpenCheckout();
  await newCheckout.closeLoginModal();
  await newCheckout.clickPlaceOrder();
  await newCheckout.expectRequiredFieldErrors();
});

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://dashboard.mageplaza.com";

const email = `test${Date.now()}@example.com`;

// Verify user can register with all valid data
test("Register with valid data", async ({ page }) => {
  await page.goto(`${BASE_URL}/customer/account/create/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator('input[name="firstname"]').fill("Teressaa");
  await page.locator('input[name="lastname"]').fill("Khachatryan");
  await page.locator('input[name="email"]').fill(email);
  await page.locator("#password").fill("superSecretPassword123!");
  await page
    .locator('input[name="password_confirmation"]')
    .fill("superSecretPassword123!");

  await expect(page.locator('input[name="firstname"]')).toHaveValue("Teressaa");
  await expect(page.locator('input[name="lastname"]')).toHaveValue(
    "Khachatryan",
  );
  await expect(page.locator('input[name="email"]')).toHaveValue(email);
  await expect(page.locator("#password")).toHaveValue(
    "superSecretPassword123!",
  );
  await expect(page.locator('input[name="password_confirmation"]')).toHaveValue(
    "superSecretPassword123!",
  );

  await page.locator(".action.submit.primary").click();
  await expect(page.locator("form#form-validate")).toBeVisible();
});

// Verify system prevents registration with invalid email
test("Register with invalid data", async ({ page }) => {
  await page.goto(`${BASE_URL}/customer/account/create/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator('input[name="firstname"]').fill("Teressaa");
  await page.locator('input[name="lastname"]').fill("");
  await page.locator('input[name="email"]').fill("test.com");
  await page.locator("#password").fill("superSecretPassword123!");
  await page
    .locator('input[name="password_confirmation"]')
    .fill("otherPassword!");

  await expect(page.locator('input[name="firstname"]')).toHaveValue("Teressaa");
  await expect(page.locator('input[name="lastname"]')).toHaveValue("");
  await expect(page.locator('input[name="email"]')).toHaveValue("test.com");
  await expect(page.locator("#password")).toHaveValue(
    "superSecretPassword123!",
  );
  await expect(page.locator('input[name="password_confirmation"]')).toHaveValue(
    "otherPassword!",
  );

  await page.locator(".action.submit.primary").click();

  await expect(page.locator("#lastname-error")).toHaveText(
    "This is a required field.",
  );
  await expect(page.locator("#email_address-error")).toHaveText(/valid email/i);
  await expect(page.locator("#password-confirmation-error")).toHaveText(
    "Please enter the same value again.",
  );
});

// Verify user can log in with valid email and password
test("Login with valid data", async ({ page }) => {
  await page.goto(`${BASE_URL}/customer/account/login/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator("#email").fill(email);
  await page.locator("#password").fill("superSecretPassword123!");

  await expect(page.locator("#email")).toHaveValue(email);
  await expect(page.locator("#password")).toHaveValue(
    "superSecretPassword123!",
  );

  await page.locator(".action.login.primary").click();
  await expect(page).toHaveURL(/account/);
});

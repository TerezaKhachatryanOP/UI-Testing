import { test, expect } from '@playwright/test';

// Verify user can register with all valid data
test('Register with valid data', async ({ page }) => {
  await page.goto('https://dashboard.mageplaza.com/customer/account/create/')

  await page.locator('input[name="firstname"]').fill('Teressaa')
  await page.locator('input[name="lastname"]').fill('Khachatryan')
  await page.locator('input[name="email"]').fill('test@example.com')
  await page.locator('#password').fill('superSecretPassword123!')
  await page.locator('input[name="password_confirmation"]').fill('superSecretPassword123!')

  await expect(page.locator('input[name="firstname"]')).toHaveValue('Teressaa');
  await expect(page.locator('input[name="lastname"]')).toHaveValue('Khachatryan');
  await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
  await expect(page.locator('#password')).toHaveValue('superSecretPassword123!');
  await expect(page.locator('input[name="password_confirmation"]')).toHaveValue('superSecretPassword123!');

  await page.locator('.action.submit.primary').click()
  await expect(page).toHaveURL(/account/);
})
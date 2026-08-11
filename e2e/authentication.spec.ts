// Third Party Libraries

// Third Party Libraries
import { expect, test } from '@playwright/test';

test.describe('authentication', () => {
  test('renders the login form and validates invalid input in the browser', async ({ page }) => {
    await page.goto('/authentication/login');

    await expect(page.getByRole('heading', { name: 'Masuk' })).toBeVisible();
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page.getByText('Masukkan alamat email yang valid')).toBeVisible();
    await expect(page.getByText('Kata sandi minimal 8 karakter')).toBeVisible();
  });
});

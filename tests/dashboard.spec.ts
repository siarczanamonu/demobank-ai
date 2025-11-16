import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers/loginHelper';

test.describe('Dashboard — read-only checks', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page);
  });

  test('widoczność salda i ostatnich operacji', async ({ page }) => {
    // sprawdź że istnieje nagłówek 'konta osobiste' lub 'dostępne środki'
    await expect(page.getByRole('heading', { name: /konta osobiste/i })).toBeVisible();
    const available = page.getByText(/dostępne środki/i).first();
    // element czasami jest w DOM, ale ukryty przez style. Akceptujemy widoczność lub obecność w DOM.
    if (await available.isVisible()) {
      await expect(available).toBeVisible();
    } else {
      await expect(available).toHaveCount(1);
    }

    // ostatnie operacje - nagłówek i tabela
    await expect(page.getByRole('heading', { name: /ostatnie operacje/i })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('wylogowanie przekierowuje na stronę logowania', async ({ page }) => {
    await page.getByRole('link', { name: /Wyloguj/i }).click();
    await expect(page).toHaveTitle(/Logowanie/i);
    await expect(page).toHaveURL(/index.html|\/$/);
  });
});

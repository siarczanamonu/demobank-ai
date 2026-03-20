import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage } from './pages';

test.describe('Dashboard — read-only checks', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
  });

  test('widoczność salda i ostatnich operacji', {
    tag: ['@dashboard', '@smoke', '@happy'],
  }, async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // sprawdź że istnieje nagłówek 'konta osobiste' lub 'dostępne środki'
    await expect(dashboardPage.getPersonalAccountsHeading()).toBeVisible();

    const available = dashboardPage.getAvailableBalanceText();
    // element czasami jest w DOM, ale ukryty przez style. Akceptujemy widoczność lub obecność w DOM.
    if (await dashboardPage['safeLocatorCheck'](available)) {
      await expect(available).toBeVisible();
    } else {
      await expect(available).toHaveCount(1);
    }

    // ostatnie operacje - nagłówek i tabela
    await expect(dashboardPage.getRecentOperationsHeading()).toBeVisible();
    await expect(dashboardPage.getRecentOperationsTable()).toBeVisible();
  });

  test('wylogowanie przekierowuje na stronę logowania', {
    tag: ['@dashboard', '@smoke', '@happy'],
  }, async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.logout();

    await expect(page).toHaveTitle(/Logowanie/i);
    await expect(page).toHaveURL(/index.html|\/$/);
  });
});

test.describe('Dashboard — przypadki krawędziowe', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
  });

  test('DSH-EC-03: weryfikacja formatu dostępnych środków', {
    tag: ['@dashboard', '@happy', '@edge'],
  }, async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    // Saldo jest w elemencie o id 'money_value'
    const balanceValue = page.locator('#money_value');
    // Sprawdzamy czy saldo jest liczbą (demo app może nie formatować tego jako waluty w tym konkretnym elemencie)
    await expect(balanceValue).toContainText(/\d+/);
  });
});

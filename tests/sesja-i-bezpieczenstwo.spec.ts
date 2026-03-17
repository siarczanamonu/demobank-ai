import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage } from './pages';

test.describe('Sesja i bezpieczeństwo', () => {
  test('SEC-TC-003: Weryfikacja stanu po odświeżeniu (wylogowanie)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // 1. Zaloguj się
    await loginPage.login();
    await expect(page).toHaveURL(/pulpit|pulpit.html/);

    // 2. Kliknij "Wyloguj"
    await dashboardPage.logout();

    // 3. Odśwież stronę
    await page.reload();

    // Weryfikacja: Użytkownik nadal jest wylogowany
    await expect(page).toHaveURL(/index.html|\/$/);
    await expect(page).toHaveTitle(/Logowanie/i);
    await expect(dashboardPage.getLogoutLink()).not.toBeVisible();
  });
});

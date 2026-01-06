import { test, expect } from '@playwright/test';
import { LoginPage, TransferPage } from './pages';

test.describe('Szybki przelew — read-only checks', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();

    // przejdź do sekcji szybkiego przelewu
    await page.getByRole('link', { name: /szybki przelew/i }).click();
    await expect(page).toHaveURL(/quick_payment.html|quick_payment|pulpit.html/);
  });

  test('formularz przelewu ma wymagane pola i przycisk aktywuje się po uzupełnieniu (nie wysyłamy przelewu)', async ({ page }) => {
    const transferPage = new TransferPage(page);

    // sprawdź że elementy są widoczne
    await transferPage.verifyFormFieldsVisible();

    // wypełnij pola (nie potwierdzamy przelewu)
    await transferPage.fillTransferForm(1, '1.00', 'Test - read-only');

    // po wypełnieniu przycisk powinien być możliwy do kliknięcia (enabled)
    await transferPage.verifyExecuteButtonEnabled();
  });
});

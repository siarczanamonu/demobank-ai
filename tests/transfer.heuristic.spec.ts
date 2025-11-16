import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers/loginHelper';
import { getFieldByNearbyText } from './helpers/formUtils';

test.describe('Szybki przelew — read-only checks (poprawiona heurystyka)', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page);
    // przejdź do sekcji szybkiego przelewu
    await page.getByRole('link', { name: /szybki przelew/i }).click();
    await expect(page).toHaveURL(/quick_payment.html|quick_payment|pulpit.html/);
  });

  test('formularz przelewu ma wymagane pola i przycisk aktywuje się po uzupełnieniu (nie wysyłamy przelewu)', async ({ page }) => {
    // odbiorca: combobox/select
    const recipientSelect = page.getByRole('combobox');
    await expect(recipientSelect).toBeVisible();

    // Używamy heurystyki: znajdź pole po pobliskim tekście
  const amountInput = await getFieldByNearbyText(page, 'kwota');
  const titleInput = await getFieldByNearbyText(page, 'tytu'); // dopasuje 'tytułem' lub 'tytul'

    const executeButton = page.getByRole('button', { name: /wykonaj/i });

    // sprawdź że elementy są widoczne
    await expect(amountInput).toBeVisible();
    await expect(titleInput).toBeVisible();
    await expect(executeButton).toBeVisible();

    // wypełnij pola (nie potwierdzamy przelewu)
    // select pierwszą rzeczywistą opcję (jeśli jest) - index 1 to zwykle pierwszy odbiorca
    try {
      await recipientSelect.selectOption({ index: 1 });
    } catch (e) {
      // some combobox implementations are not HTML <select>; fallback do kliknięcia pierwszej opcji jeśli istnieje
  const option = page.locator('text=/^\\s*(Jan Demobankowy|Chuck Demobankowy|Michael Scott)\\s*$/i').first();
      if (await option.count()) {
        await option.click();
      }
    }

    await amountInput.fill('1.00');
    await titleInput.fill('Test - read-only (heuristics)');

    // po wypełnieniu przycisk powinien być możliwy do kliknięcia (enabled)
    await expect(executeButton).toBeEnabled();
  });
});

import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers/loginHelper';
import { getFieldByNearbyText } from './helpers/formUtils';

test.describe('Szybki przelew — read-only checks', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page);
    // przejdź do sekcji szybkiego przelewu
    await page.getByRole('link', { name: /szybki przelew/i }).click();
    await expect(page).toHaveURL(/quick_payment.html|quick_payment|pulpit.html/);
  });

  test('formularz przelewu ma wymagane pola i przycisk aktywuje się po uzupełnieniu (nie wysyłamy przelewu)', async ({ page }) => {
    const recipientSelect = page.getByRole('combobox');
    let amountInput = await getFieldByNearbyText(page, 'kwota');
    const titleInput = await getFieldByNearbyText(page, 'tytu');

    // Jeśli heurystyka zwróciła <select> (czasem struktura DOM jest inna), spróbuj pobrać
    // pierwsze input następujące po elemencie zawierającym tekst 'kwota'
    try {
      const tag = await amountInput.evaluate((el: Element) => el?.tagName?.toLowerCase()).catch(() => null);
      if (tag === 'select') {
        const fallback = page.locator(`xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "kwota")])/following::input[1]`).first();
        if (await fallback.count()) amountInput = fallback;
      }
    } catch (e) {
      // ignore and continue with whatever locator we have
    }
    const executeButton = page.getByRole('button', { name: /wykonaj|wykonaj/i });

    // sprawdź że elementy są widoczne
    await expect(recipientSelect).toBeVisible();
    await expect(amountInput).toBeVisible();
    await expect(titleInput).toBeVisible();
    await expect(executeButton).toBeVisible();

    // wypełnij pola (nie potwierdzamy przelewu)
    await recipientSelect.selectOption({ index: 1 });
    await amountInput.fill('1.00');
    await titleInput.fill('Test - read-only');

    // po wypełnieniu przycisk powinien być możliwy do kliknięcia (enabled)
    await expect(executeButton).toBeEnabled();
  });
});

import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TransferPage object encapsulates all quick payment/transfer form interactions
 * Handles complex form field location with heuristic strategies
 */
export class TransferPage extends BasePage {
  /**
   * Get recipient selector (combobox) locator
   * @returns Locator for recipient combobox
   */
  private getRecipientSelector(): Locator {
    return this.page.getByRole('combobox');
  }

  /**
   * Get execute/submit button locator
   * @returns Locator for execute button
   */
  private getExecuteButton(): Locator {
    return this.page.getByRole('button', { name: /wykonaj|wykonaj/i });
  }

  /**
   * Find amount input field using heuristic strategies
   * Tries multiple strategies to locate the field by nearby text "kwota"
   * @returns Locator for amount input field
   */
  private async getAmountInputField(): Promise<Locator> {
    const search = 'kwota'.toLowerCase();

    const makeXpath = (inner: string) =>
      `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])${inner}`;

    // Strategy 1: input inside element containing text
    const inputLocator = this.page.locator(makeXpath('//input')).first();
    if ((await inputLocator.count()) > 0) return inputLocator;

    // Strategy 2: textarea inside element containing text
    const textareaLocator = this.page.locator(makeXpath('//textarea')).first();
    if ((await textareaLocator.count()) > 0) return textareaLocator;

    // Strategy 3: input following element containing text
    const followingInput = this.page.locator(makeXpath('/following::input[1]')).first();
    if ((await followingInput.count()) > 0) return followingInput;

    // Strategy 4: select inside (fallback)
    const selectLocator = this.page.locator(makeXpath('//select')).first();
    if ((await selectLocator.count()) > 0) return selectLocator;

    // Strategy 5: union fallback
    const union = this.page.locator(
      `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//input | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//textarea | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//select | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])/following::input[1]`,
    ).first();
    return union;
  }

  /**
   * Find title input field using heuristic strategies
   * Tries multiple strategies to locate the field by nearby text "tytu"
   * @returns Locator for title input field
   */
  private async getTitleInputField(): Promise<Locator> {
    const search = 'tytu'.toLowerCase();

    const makeXpath = (inner: string) =>
      `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])${inner}`;

    // Strategy 1: input inside
    const inputLocator = this.page.locator(makeXpath('//input')).first();
    if ((await inputLocator.count()) > 0) return inputLocator;

    // Strategy 2: textarea inside
    const textareaLocator = this.page.locator(makeXpath('//textarea')).first();
    if ((await textareaLocator.count()) > 0) return textareaLocator;

    // Strategy 3: input following
    const followingInput = this.page.locator(makeXpath('/following::input[1]')).first();
    if ((await followingInput.count()) > 0) return followingInput;

    // Strategy 4: select fallback
    const selectLocator = this.page.locator(makeXpath('//select')).first();
    if ((await selectLocator.count()) > 0) return selectLocator;

    // Strategy 5: union fallback
    const union = this.page.locator(
      `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//input | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//textarea | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//select | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])/following::input[1]`,
    ).first();
    return union;
  }

  /**
   * Detect field element type and handle type mismatch with fallback
   * @param locator - Locator to check
   * @returns Detected field type or fallback
   */
  private async detectFieldType(locator: Locator): Promise<'input' | 'select'> {
    try {
      const tag = await locator.evaluate((el: Element) => el?.tagName?.toLowerCase()).catch(() => null);
      return tag === 'select' ? 'select' : 'input';
    } catch {
      return 'input';
    }
  }

  /**
   * Verify transfer page is loaded and form is visible
   * @throws Error if page or form not loaded
   */
  async verifyTransferPageLoaded(): Promise<void> {
    await this.waitForPageLoad(/quick_payment.html|quick_payment|pulpit.html/);
    await this.verifyFormFieldsVisible();
  }

  /**
   * Verify all required form fields are visible
   * @throws Error if any field is not visible
   */
  async verifyFormFieldsVisible(): Promise<void> {
    const recipientSelect = this.getRecipientSelector();
    const amountInput = await this.getAmountInputField();
    const titleInput = await this.getTitleInputField();
    const executeButton = this.getExecuteButton();

    await expect(recipientSelect).toBeVisible();
    await expect(amountInput).toBeVisible();
    await expect(titleInput).toBeVisible();
    await expect(executeButton).toBeVisible();
  }

  /**
   * Verify execute button is enabled (clickable)
   * @throws Error if button is not enabled
   */
  async verifyExecuteButtonEnabled(): Promise<void> {
    const executeButton = this.getExecuteButton();
    await expect(executeButton).toBeEnabled();
  }

  /**
   * Select recipient by option index
   * @param index - Index of recipient option to select
   * @throws Error if selector not found or selection fails
   */
  async selectRecipient(index: number): Promise<void> {
    const recipientSelect = this.getRecipientSelector();
    await this.waitForVisible(recipientSelect);
    await recipientSelect.selectOption({ index });
  }

  /**
   * Fill amount field with provided value
   * Handles type detection and fallback for unexpected element types
   * @param amount - Amount to fill (e.g., "100.50")
   * @throws Error if field not found or fill fails
   */
  async fillAmount(amount: string): Promise<void> {
    let amountInput = await this.getAmountInputField();

    // Check if we got a select when we expected input, try fallback
    const fieldType = await this.detectFieldType(amountInput);
    if (fieldType === 'select') {
      // Try fallback strategy for input
      const fallback = this.page
        .locator(
          `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "kwota")])/following::input[1]`,
        )
        .first();
      if ((await fallback.count()) > 0) {
        amountInput = fallback;
      }
    }

    await this.waitForVisible(amountInput);
    await amountInput.fill(amount);
  }

  /**
   * Fill title field with provided value
   * @param title - Title/description to fill
   * @throws Error if field not found or fill fails
   */
  async fillTitle(title: string): Promise<void> {
    let titleInput = await this.getTitleInputField();

    // Check if we got a select when we expected input, try fallback
    const fieldType = await this.detectFieldType(titleInput);
    if (fieldType === 'select') {
      // Try fallback strategy for input
      const fallback = this.page
        .locator(
          `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "tytu")])/following::input[1]`,
        )
        .first();
      if ((await fallback.count()) > 0) {
        titleInput = fallback;
      }
    }

    await this.waitForVisible(titleInput);
    await titleInput.fill(title);
  }

  /**
   * Fill entire transfer form with all required fields
   * Convenience method that fills recipient, amount, and title in sequence
   * @param recipientIndex - Index of recipient to select
   * @param amount - Amount to transfer
   * @param title - Transfer title
   */
  async fillTransferForm(recipientIndex: number, amount: string, title: string): Promise<void> {
    await this.selectRecipient(recipientIndex);
    await this.fillAmount(amount);
    await this.fillTitle(title);
  }

  /**
   * Click the execute/submit button
   * @throws Error if button not found or click fails
   */
  async clickExecute(): Promise<void> {
    const executeButton = this.getExecuteButton();
    await this.waitForVisible(executeButton);
    await this.waitForEnabled(executeButton);
    await executeButton.click();
  }

  /**
   * Submit transfer (fill form and click execute)
   * Convenience method for complete transfer flow
   * @param recipientIndex - Index of recipient
   * @param amount - Amount to transfer
   * @param title - Transfer title
   */
  async submitTransfer(recipientIndex: number, amount: string, title: string): Promise<void> {
    await this.fillTransferForm(recipientIndex, amount, title);
    await this.clickExecute();
  }
}

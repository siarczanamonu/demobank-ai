import { Page, Locator } from '@playwright/test';

/**
 * Abstract base class for all page objects.
 * Provides common utilities and encapsulates the Playwright page instance.
 */
export abstract class BasePage {
  /**
   * Protected page instance - accessible to subclasses only
   */
  protected page: Page;

  /**
   * Initialize page object with Playwright page instance
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to load by URL pattern
   * @param urlPattern - Optional regex pattern to match URL
   */
  protected async waitForPageLoad(urlPattern?: RegExp | string): Promise<void> {
    if (urlPattern) {
      await this.page.waitForURL(urlPattern, { timeout: 5000 });
    }
  }

  /**
   * Safely check if a locator exists and is visible
   * Useful for optional elements that may not always be present
   * @param locator - Playwright Locator to check
   * @returns true if element exists and is visible, false otherwise
   */
  protected async safeLocatorCheck(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible with standard timeout
   * @param locator - Playwright Locator to wait for
   * @param timeout - Optional timeout in milliseconds (default 5000)
   */
  protected async waitForVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be enabled with standard timeout
   * @param locator - Playwright Locator to wait for
   * @param timeout - Optional timeout in milliseconds (default 5000)
   */
  protected async waitForEnabled(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
    // Additional check to ensure button/input is actually enabled
    await this.page.waitForFunction(
      () => {
        const el = document.activeElement as HTMLButtonElement | HTMLInputElement;
        return !el?.disabled;
      },
      { timeout },
    );
  }
}

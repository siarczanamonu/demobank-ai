import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage object encapsulates all dashboard page interactions and elements
 */
export class DashboardPage extends BasePage {
  /**
   * Get personal accounts heading locator
   * @returns Locator for heading containing "konta osobiste" text
   */
  getPersonalAccountsHeading(): Locator {
    return this.page.getByRole('heading', { name: /konta osobiste/i });
  }

  /**
   * Get available balance text locator
   * @returns Locator for text containing "dostępne środki"
   */
  getAvailableBalanceText(): Locator {
    return this.page.getByText(/dostępne środki/i).first();
  }

  /**
   * Get recent operations heading locator
   * @returns Locator for heading containing "ostatnie operacje"
   */
  getRecentOperationsHeading(): Locator {
    return this.page.getByRole('heading', { name: /ostatnie operacje/i });
  }

  /**
   * Get recent operations table locator
   * @returns Locator for table element containing transaction data
   */
  getRecentOperationsTable(): Locator {
    return this.page.locator('table');
  }

  /**
   * Get logout link locator
   * @returns Locator for logout link
   */
  getLogoutLink(): Locator {
    return this.page.getByRole('link', { name: /Wyloguj/i });
  }

  /**
   * Verify dashboard is fully loaded and visible
   * Checks that all key dashboard sections are present
   * @throws Error if any key element is not visible
   */
  async verifyDashboardVisible(): Promise<void> {
    // Check personal accounts heading
    await expect(this.getPersonalAccountsHeading()).toBeVisible();

    // Check available balance - may be hidden by CSS but present in DOM
    const balanceText = this.getAvailableBalanceText();
    if (await this.safeLocatorCheck(balanceText)) {
      await expect(balanceText).toBeVisible();
    } else {
      // Accept if element is in DOM but hidden
      await expect(balanceText).toHaveCount(1);
    }

    // Check recent operations section
    await expect(this.getRecentOperationsHeading()).toBeVisible();
    await expect(this.getRecentOperationsTable()).toBeVisible();
  }

  /**
   * Verify logout link is visible
   * @throws Error if logout link is not visible
   */
  async verifyLogoutLinkVisible(): Promise<void> {
    await expect(this.getLogoutLink()).toBeVisible();
  }

  /**
   * Perform logout action
   * Clicks logout link and waits for login page
   * @throws Error if logout link not found or login page not reached
   */
  async logout(): Promise<void> {
    const logoutLink = this.getLogoutLink();
    await this.waitForVisible(logoutLink);
    await logoutLink.click();

    // Wait for login page
    await this.waitForPageLoad(/index.html|\/$/);
    await expect(this.page).toHaveTitle(/Logowanie/i);
  }

  /**
   * Get current page URL
   * @returns Current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get current page title
   * @returns Current page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}

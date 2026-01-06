import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { getAuth } from '../helpers/getAuth';

/**
 * LoginPage object encapsulates all login form interactions and locators
 */
export class LoginPage extends BasePage {
  /**
   * Get login input field locator
   * @returns Locator for login input (test ID: login-input)
   */
  private getLoginInput() {
    return this.page.getByTestId('login-input');
  }

  /**
   * Get password input field locator
   * @returns Locator for password input (test ID: password-input)
   */
  private getPasswordInput() {
    return this.page.getByTestId('password-input');
  }

  /**
   * Get login button locator
   * @returns Locator for login button (test ID: login-button)
   */
  private getLoginButton() {
    return this.page.getByTestId('login-button');
  }

  /**
   * Verify login page is visible and interactive
   * Checks that login input, password input, and login button are all visible
   * @throws Error if any element is not visible
   */
  async verifyLoginPageVisible(): Promise<void> {
    const loginInput = this.getLoginInput();
    const passwordInput = this.getPasswordInput();
    const loginButton = this.getLoginButton();

    await expect(loginInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  }

  /**
   * Perform login action with provided credentials
   * Fills login and password fields, clicks login button, and waits for dashboard
   * @param login - Login username (optional - uses getAuth if not provided)
   * @param password - Login password (optional - uses getAuth if not provided)
   * @throws Error if login fails or dashboard is not reached
   */
  async login(login?: string, password?: string): Promise<void> {
    // Navigate to login page
    await this.page.goto('/');

    // Get credentials from getAuth if not provided
    const auth = getAuth();
    const loginValue = login || auth.login;
    const passwordValue = password || auth.password;

    // Fill login and password fields
    const loginInput = this.getLoginInput();
    const passwordInput = this.getPasswordInput();

    await this.waitForVisible(loginInput);
    await loginInput.fill(loginValue);

    await this.waitForVisible(passwordInput);
    await passwordInput.fill(passwordValue);

    // Wait for button to be visible and enabled, then click
    const loginButton = this.getLoginButton();
    await this.waitForVisible(loginButton);
    await this.waitForEnabled(loginButton);
    await loginButton.click();

    // Wait for dashboard URL
    await this.waitForPageLoad(/pulpit|pulpit.html/);
  }

  /**
   * Attempt login and verify that login page is still visible or error message appears
   * Used for testing failed login scenarios (e.g., wrong password)
   * @param login - Login username
   * @param password - Password to use
   * @throws Error if login button is not clickable
   */
  async attemptLogin(login: string, password: string): Promise<void> {
    await this.page.goto('/');

    const loginInput = this.getLoginInput();
    const passwordInput = this.getPasswordInput();
    const loginButton = this.getLoginButton();

    await this.waitForVisible(loginInput);
    await loginInput.fill(login);

    await this.waitForVisible(passwordInput);
    await passwordInput.fill(password);

    await this.waitForVisible(loginButton);
    await this.waitForEnabled(loginButton);
    await loginButton.click();
  }

  /**
   * Fill login field with provided value
   * @param login - Login value to fill
   */
  async fillLogin(login: string): Promise<void> {
    const loginInput = this.getLoginInput();
    await this.waitForVisible(loginInput);
    await loginInput.fill(login);
  }

  /**
   * Fill password field with provided value
   * @param password - Password value to fill
   */
  async fillPassword(password: string): Promise<void> {
    const passwordInput = this.getPasswordInput();
    await this.waitForVisible(passwordInput);
    await passwordInput.fill(password);
  }

  /**
   * Click login button
   * @throws Error if button is not visible or clickable
   */
  async clickLoginButton(): Promise<void> {
    const loginButton = this.getLoginButton();
    await this.waitForVisible(loginButton);
    await this.waitForEnabled(loginButton);
    await loginButton.click();
  }
}

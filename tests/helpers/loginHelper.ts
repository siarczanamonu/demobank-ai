import { Page } from '@playwright/test';
import { getAuth } from './getAuth';

export async function uiLogin(page: Page) {
  const auth = getAuth();
  await page.goto('/');
  // Prefer test ids (present in the demo app)
  await page.getByTestId('login-input').fill(auth.login);
  await page.getByTestId('password-input').fill(auth.password);
  const loginButton = page.getByTestId('login-button');
  // wait until button is visible/enabled then click
  await loginButton.waitFor({ state: 'visible', timeout: 5000 });
  await loginButton.click();
  // wait for dashboard url
  await page.waitForURL(/pulpit|pulpit.html/);
}

# Spec: LoginPage Object

## ADDED Requirements

### Requirement: LoginPage class SHALL provide login form locators and actions
**Status**: New  
**Priority**: P0 (Critical)  
**Category**: Test Infrastructure

The LoginPage class SHALL encapsulate all login form interactions, replacing direct `page.getByTestId()` calls in tests.

#### Scenario: User fills login form and submits
- LoginPage provides methods: `login(login: string, password: string): Promise<void>`
- Method fills login input, password input, and clicks login button
- Method waits for dashboard URL (`/pulpit` or `pulpit.html`)
- No test code needs to know about test IDs or button selectors

#### Scenario: LoginPage exposes verification method
- LoginPage provides: `verifyLoginPageVisible(): Promise<void>`
- Method checks that login input, password input, and login button are visible
- Throws if any element is not visible (fail-fast for setup issues)

#### Scenario: LoginPage constructor accepts Playwright page
- Constructor: `constructor(page: Page)`
- Stores page instance for use in all methods
- No direct `page` property exported (encapsulated)

---

## MODIFIED Requirements

### Requirement: LoginPage MUST consolidate loginHelper functionality
**Status**: Change  
**Priority**: P1 (High)  

The existing `tests/helpers/loginHelper.ts` contains `uiLogin()` function. This logic MUST migrate into `LoginPage.login()` method.

#### Scenario: LoginPage.login() provides same functionality as uiLogin()
- Fills login input with credentials from `getAuth()`
- Fills password input with credentials from `getAuth()`
- Waits for login button visibility and enabled state
- Clicks login button
- Waits for dashboard URL
- Migrated from `loginHelper.ts` → internal implementation of `LoginPage`

---

## REMOVED Requirements

### Requirement: Direct test ID access in login tests
**Status**: Removed  
**Priority**: N/A

Tests no longer call `page.getByTestId('login-input')` directly.
- All locator strategy moves into LoginPage class
- Tests use high-level methods: `loginPage.login()`, `loginPage.verifyLoginPageVisible()`

---

## Implementation Notes

- **File**: `tests/pages/LoginPage.ts`
- **Extends**: BasePage
- **Depends on**: Playwright Page, `getAuth()` helper
- **TypeScript**: Strict mode, full type coverage
- **Async/await**: All methods async (Playwright pattern)

## Related Pages

- DashboardPage (verification after login)
- BasePage (shared waits and utilities)

# Spec: DashboardPage Object

## ADDED Requirements

### Requirement: DashboardPage class SHALL encapsulate dashboard elements
**Status**: New  
**Priority**: P0 (Critical)  
**Category**: Test Infrastructure

The DashboardPage class SHALL centralize all dashboard page interactions and verifications.

#### Scenario: DashboardPage provides dashboard element locators via public methods
- `getPersonalAccountsHeading(): Locator` – returns locator for "konta osobiste" heading
- `getAvailableBalanceText(): Locator` – returns locator for "dostępne środki" text
- `getRecentOperationsTable(): Locator` – returns locator for transactions table
- `getLogoutLink(): Locator` – returns locator for logout link
- All locators use Playwright's `getByRole()` or `getByText()` for maintainability

#### Scenario: DashboardPage provides verification methods
- `verifyDashboardVisible(): Promise<void>` – confirms all key dashboard sections visible
  - Personal accounts heading visible
  - Available balance (either visible or in DOM)
  - Recent operations heading visible
  - Recent operations table visible
- `verifyLogoutLinkVisible(): Promise<void>` – checks logout link is visible

#### Scenario: DashboardPage provides logout action
- `logout(): Promise<void>` – clicks logout link and waits for login page
- Waits for login page URL (`index.html` or `/`)
- Waits for "Logowanie" title

#### Scenario: DashboardPage constructor accepts Playwright page
- Constructor: `constructor(page: Page)`
- Stores page instance for all methods
- No direct `page` property exported

---

## MODIFIED Requirements

### Requirement: Dashboard locators MUST be centralized
**Status**: Change  
**Priority**: P1 (High)

Dashboard tests currently scatter `page.getByRole()` and `page.getByText()` calls. These MUST be consolidated into DashboardPage.

#### Scenario: Dashboard element location rules preserved in page object
- Role-based queries (`getByRole('heading', { name: /.../ })`) remain unchanged
- Text-based queries (`getByText(/.../)`) moved to page object methods
- UI changes require only DashboardPage updates, not test file changes

---

## REMOVED Requirements

### Requirement: Direct dashboard element access in test files
**Status**: Removed  
**Priority**: N/A

Tests no longer call `page.getByRole('heading', ...)` directly.
- All locators are private to DashboardPage
- Tests use semantic methods: `dashboardPage.verifyDashboardVisible()`, `dashboardPage.logout()`

---

## Implementation Notes

- **File**: `tests/pages/DashboardPage.ts`
- **Extends**: BasePage
- **Depends on**: Playwright Page
- **TypeScript**: Strict mode, full type coverage
- **Async/await**: All public methods async where they perform actions

## Related Pages

- LoginPage (login leads to dashboard)
- TransferPage (user navigates from dashboard)
- BasePage (shared waits and utilities)

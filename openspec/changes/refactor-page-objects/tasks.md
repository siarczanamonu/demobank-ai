# Tasks: Page Object Model Refactoring

## Sequencing Notes
- **Phase 1** (Page Objects Creation): Can be done in parallel (tasks 1–4)
- **Phase 2** (Test Migration): Sequential (tasks 5–9) – each depends on page object being ready
- **Phase 3** (Cleanup & Validation): Sequential (tasks 10–11)

---

## Phase 1: Create Page Object Classes

### Task 1: Create BasePage base class
**Dependency**: None  
**Parallel**: Yes (independent)

- Create `tests/pages/BasePage.ts`
- Export abstract class `BasePage`
- Implement common utilities:
  - Constructor accepting `page: Page`
  - Protected `page` property (accessible to subclasses only)
  - Protected method: `waitForPageLoad(urlPattern?: string): Promise<void>`
  - Protected method: `safeLocatorCheck(locator: Locator): Promise<boolean>` for optional element checks
- Ensure strict TypeScript (no `any` types)
- Include JSDoc comments for public API

**Validation**:
- File compiles without errors
- Class is abstract and cannot be instantiated directly
- Subclasses can extend it

---

### Task 2: Create LoginPage page object
**Dependency**: BasePage (Task 1)  
**Parallel**: Yes (after Task 1)

- Create `tests/pages/LoginPage.ts`
- Extend BasePage
- Implement public methods:
  - `login(login: string, password: string): Promise<void>`
    - Uses `getAuth()` style credentials (or accepts params)
    - Fills `testid=login-input` with login
    - Fills `testid=password-input` with password
    - Waits for button visible/enabled
    - Clicks login button
    - Waits for dashboard URL (`/pulpit` or `pulpit.html`)
  - `verifyLoginPageVisible(): Promise<void>` – check form is visible
- Migrate logic from `tests/helpers/loginHelper.ts` `uiLogin()` function
- Include JSDoc for all public methods

**Validation**:
- File compiles without errors
- Extends BasePage correctly
- Can be instantiated: `new LoginPage(page)`
- All methods have correct return types

---

### Task 3: Create DashboardPage page object
**Dependency**: BasePage (Task 1)  
**Parallel**: Yes (after Task 1)

- Create `tests/pages/DashboardPage.ts`
- Extend BasePage
- Implement public methods:
  - `getPersonalAccountsHeading(): Locator`
  - `getAvailableBalanceText(): Locator`
  - `getRecentOperationsTable(): Locator`
  - `getLogoutLink(): Locator`
  - `verifyDashboardVisible(): Promise<void>` – check all key elements
  - `verifyLogoutLinkVisible(): Promise<void>`
  - `logout(): Promise<void>` – click logout, wait for login page
- Use `page.getByRole()` and `page.getByText()` selectors from current dashboard.spec.ts
- Include JSDoc for all public methods

**Validation**:
- File compiles without errors
- Extends BasePage correctly
- All locators use proper Playwright methods
- logout() waits for login page properly

---

### Task 4: Create TransferPage page object
**Dependency**: BasePage (Task 1)  
**Parallel**: Yes (after Task 1)

- Create `tests/pages/TransferPage.ts`
- Extend BasePage
- Implement private helper methods:
  - `getAmountInputField(): Promise<Locator>` – heuristic field finding (from formUtils logic)
  - `getTitleInputField(): Promise<Locator>` – heuristic field finding
  - `detectFieldType(locator: Locator): Promise<'input' | 'select'>` – type detection and fallback
- Implement public methods:
  - `selectRecipient(index: number): Promise<void>`
  - `fillAmount(amount: string): Promise<void>`
  - `fillTitle(title: string): Promise<void>`
  - `fillTransferForm(recipientIndex: number, amount: string, title: string): Promise<void>` (convenience)
  - `verifyFormFieldsVisible(): Promise<void>`
  - `verifyExecuteButtonEnabled(): Promise<void>`
  - `verifyTransferPageLoaded(): Promise<void>`
  - `clickExecute(): Promise<void>`
  - `submitTransfer(recipientIndex: number, amount: string, title: string): Promise<void>` (convenience)
- Migrate heuristic logic from `tests/helpers/formUtils.ts`
- Include JSDoc for all public methods

**Validation**:
- File compiles without errors
- Extends BasePage correctly
- Private methods handle type detection properly
- Public methods encapsulate all form interaction logic

---

### Task 5: Create pages/index.ts export file
**Dependency**: Tasks 2, 3, 4  
**Parallel**: No (after all page objects created)

- Create `tests/pages/index.ts`
- Export all page objects: `export { BasePage } from './BasePage'; export { LoginPage } from './LoginPage';` etc.
- Tests can then use: `import { LoginPage, DashboardPage, TransferPage } from './pages';`

**Validation**:
- File compiles without errors
- All exports are correct
- Tests can import from index

---

## Phase 2: Migrate Test Files

### Task 6: Update login.spec.ts to use LoginPage
**Dependency**: LoginPage (Task 2), pages/index.ts (Task 5)  
**Parallel**: No (sequential test migration)

- Import LoginPage: `import { LoginPage } from './pages';`
- Remove import of `getAuth` (moved into LoginPage)
- Update test: "happy path: logowanie UI"
  - Create `const loginPage = new LoginPage(page)` in test
  - Replace manual fills + click with: `await loginPage.login(auth.login, auth.password);`
  - Keep expectation: `await expect(page).toHaveURL(/pulpit|pulpit.html/);`
  - Keep expectation: logout link visible
- Update test: "niepoprawne hasło blokuje wejście"
  - Use LoginPage to fill login
  - Manually fill password with "wrong-password" (or add `fillPasswordOnly()` method if preferred)
  - Keep existing assertions (error handling, page state after failed login)

**Validation**:
- `npm run test -- login.spec.ts` passes
- No TypeScript errors
- Tests read more semantically (`loginPage.login()` vs scattered fills)

---

### Task 7: Update dashboard.spec.ts to use DashboardPage
**Dependency**: DashboardPage (Task 3), pages/index.ts (Task 5)  
**Parallel**: No (sequential)

- Import DashboardPage: `import { DashboardPage } from './pages';`
- Update test setup (beforeEach):
  - Create `const dashboardPage = new DashboardPage(page)` after login
  - (Keep LoginPage for login in beforeEach)
- Update test: "widoczność salda i ostatnich operacji"
  - Replace manual assertions with: `await dashboardPage.verifyDashboardVisible();`
  - Keep table visibility check or move into DashboardPage verification if preferred
- Update test: "wylogowanie przekierowuje na stronę logowania"
  - Replace `page.getByRole('link', ...)` click with: `await dashboardPage.logout();`
  - Keep or remove explicit URL/title assertions (logout method should handle waits)

**Validation**:
- `npm run test -- dashboard.spec.ts` passes
- No TypeScript errors
- Dashboard tests use page object cleanly

---

### Task 8: Update transfer.spec.ts to use TransferPage
**Dependency**: TransferPage (Task 4), pages/index.ts (Task 5)  
**Parallel**: No (sequential)

- Import TransferPage: `import { TransferPage } from './pages';`
- Remove import of `getFieldByNearbyText` (migrated to TransferPage)
- Update test setup (beforeEach):
  - Create `const transferPage = new TransferPage(page)` after login + navigation
  - (Keep LoginPage + DashboardPage for setup)
- Update test: "formularz przelewu ma wymagane pola..."
  - Replace manual field getting + type checking with: `await transferPage.verifyFormFieldsVisible();`
  - Replace manual fills with:
    ```typescript
    await transferPage.selectRecipient(1);
    await transferPage.fillAmount('1.00');
    await transferPage.fillTitle('Test - read-only');
    ```
  - Replace manual button enable check with: `await transferPage.verifyExecuteButtonEnabled();`
  - Remove complex try/catch workarounds (encapsulated in TransferPage)

**Validation**:
- `npm run test -- transfer.spec.ts` passes
- No TypeScript errors
- Test code is much cleaner and more readable
- Form interaction logic removed from test file

---

### Task 9: Update transfer.heuristic.spec.ts to use TransferPage
**Dependency**: TransferPage (Task 4), pages/index.ts (Task 5)  
**Parallel**: No (sequential, after Task 8)

- Same pattern as Task 8
- Update imports, setup, and test methods to use TransferPage
- Verify heuristic form field finding still works with page object abstraction

**Validation**:
- `npm run test -- transfer.heuristic.spec.ts` passes
- No TypeScript errors

---

## Phase 3: Cleanup & Validation

### Task 10: Remove old helper files
**Dependency**: Tasks 6–9 (all tests migrated)  
**Parallel**: No

- Delete `tests/helpers/loginHelper.ts` (logic migrated to LoginPage)
- Delete `tests/helpers/formUtils.ts` (logic migrated to TransferPage)
- Keep `tests/helpers/getAuth.ts` (still used by tests/page objects for credentials)

**Validation**:
- Verify no imports of deleted files remain in codebase
- Run `grep -r "loginHelper" tests/` – should return nothing
- Run `grep -r "formUtils" tests/` – should return nothing

---

### Task 11: Run full test suite and validate
**Dependency**: Task 10  
**Parallel**: No (final validation)

- Run: `npm run test` (or `npx playwright test`)
- Verify all tests pass (login, dashboard, transfer, transfer.heuristic)
- Check TypeScript compilation: `npx tsc --noEmit`
- Check ESLint: `npm run lint` (or `npx eslint .`)
- Verify no console errors or warnings
- Update `example.spec.ts` if it uses old patterns (minimal changes expected)
- Update `seed.spec.ts` if it uses old patterns (minimal changes expected)

**Validation**:
- All tests pass
- No TypeScript errors
- No ESLint violations
- Code review ready: Page objects reduce LOC, improve readability, centralize UI logic

---

## Parallelization Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| **Phase 1** | 1–4 | Can run in parallel (1 can go first, then 2–4 in parallel) |
| **Phase 2** | 5–9 | Sequential (each depends on previous test file migrated) |
| **Phase 3** | 10–11 | Sequential (cleanup depends on all migrations complete) |

**Estimated Total Time**: 
- Phase 1: ~2–3 hours (page object creation, type safety, docs)
- Phase 2: ~2–3 hours (test file migrations)
- Phase 3: ~30 min (cleanup, validation)
- **Total**: ~5–6.5 hours (can be parallelized to reduce wall time)

---

## Success Criteria

- ✅ All tests pass (green suite)
- ✅ Zero TypeScript errors
- ✅ Zero ESLint violations
- ✅ All page objects have JSDoc comments
- ✅ No old helper files remain
- ✅ Test code is more readable (semantic method names)
- ✅ UI changes require only page object updates (no test file changes needed)
- ✅ Code review approval before merging

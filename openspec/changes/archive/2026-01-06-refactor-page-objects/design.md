# Design: Page Object Model Architecture

## Architecture Overview

### File Structure
```
tests/
├── pages/                           # NEW: Page Objects
│   ├── BasePage.ts                  # Base class with common utilities
│   ├── LoginPage.ts                 # Login form page object
│   ├── DashboardPage.ts             # Dashboard page object
│   ├── TransferPage.ts              # Quick payment form page object
│   └── index.ts                     # Centralized exports
├── helpers/                         # MIGRATED: only shared utilities remain
│   ├── getAuth.ts                   # ✓ keep – auth credential loading
│   └── [removed] loginHelper.ts     # → migrate into LoginPage
│       [removed] formUtils.ts       # → integrate into page objects
├── login.spec.ts                    # UPDATED: uses LoginPage, DashboardPage
├── dashboard.spec.ts                # UPDATED: uses DashboardPage
├── transfer.spec.ts                 # UPDATED: uses TransferPage
├── transfer.heuristic.spec.ts       # UPDATED: uses TransferPage
├── example.spec.ts                  # UPDATED: uses appropriate page objects
└── seed.spec.ts                     # UPDATED: minimal migration (mostly direct setup)
```

### Page Object Hierarchy

```
BasePage (abstract)
├── common utilities (waits, logging)
├── page instance management
└── type safety

  └─ LoginPage extends BasePage
     ├── login input field
     ├── password input field
     ├── login button
     └── uiLogin() method

  └─ DashboardPage extends BasePage
     ├── personal accounts heading
     ├── available balance text
     ├── recent operations table
     ├── logout link
     └── verification methods

  └─ TransferPage extends BasePage
     ├── recipient selector (combobox)
     ├── amount input field
     ├── title input field
     ├── execute button
     └── interaction methods
```

### Method Naming Convention

**User Actions** (public async methods):
- `login(login: string, password: string): Promise<void>`
- `fillTransferForm(recipient: string, amount: string, title: string): Promise<void>`
- `clickExecute(): Promise<void>`
- `clickLogout(): Promise<void>`

**Assertions** (public methods that verify state):
- `verifyDashboardVisible(): Promise<void>`
- `verifyFormFieldsVisible(): Promise<void>`
- `verifyExecuteButtonEnabled(): Promise<void>`

**Internal Helpers** (private async methods):
- `getAmountInput(): Promise<Locator>` – heuristic field finding
- `waitForPageLoad(): Promise<void>` – URL/state waits

### Error Handling Strategy

Each page object method:
1. Validates preconditions (is page visible?)
2. Executes action with appropriate Playwright waits
3. Logs on failure for debugging
4. Propagates errors to test (no silent failures)

Example:
```typescript
async fillAmount(amount: string): Promise<void> {
  const field = await this.getAmountInputField();
  if (!await field.isVisible()) throw new Error('Amount field not visible');
  await field.fill(amount);
}
```

### Migration Path

**Phase 1**: Create page object classes (no changes to tests yet)
- BasePage, LoginPage, DashboardPage, TransferPage
- Full test coverage in isolation

**Phase 2**: Update test files to use page objects
- Import page classes
- Replace direct `page.getByTestId()` calls with page methods
- Verify tests pass with new structure

**Phase 3**: Clean up old helpers
- Remove `loginHelper.ts` (logic in LoginPage)
- Remove `formUtils.ts` (logic in TransferPage)
- Keep `getAuth.ts` (purely functional, not UI-related)

### Key Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Single Responsibility** | Each page object represents one logical page/section |
| **Encapsulation** | Page internals (locators, waits) are private; only methods are public |
| **DRY (Don't Repeat Yourself)** | Shared form logic in BasePage; reused by child objects |
| **Readability** | Method names match user actions: `login()`, `fillTransferForm()`, `clickLogout()` |
| **Type Safety** | Full TypeScript types; no `any` types in page objects |
| **Maintainability** | UI change = update one locator in one file |

### Dependency Graph

```
Tests
  ↓
Page Objects (LoginPage, DashboardPage, TransferPage)
  ↓
BasePage
  ↓
Playwright (@playwright/test)
  ↓
getAuth (for credentials)
```

### Testing the Page Objects

Each page object class will be usable in:
- All spec files (login.spec.ts, dashboard.spec.ts, transfer.spec.ts)
- Future new tests without duplication
- Integration tests in CI/CD

### Trade-offs

| Trade-off | Decision | Rationale |
|-----------|----------|-----------|
| Class-based vs static methods | **Class-based** | Allows per-instance state/logging if needed |
| Encapsulation vs helper functions | **Encapsulation** | Better OOP structure, clearer ownership |
| Constructor dependencies | **Inject `page` only** | Minimal, keeps tests in control |
| Error handling strategy | **Throw early** | Tests see all failures immediately |

---

## Related Specs

See individual spec files:
- `specs/login-page-object/spec.md` – LoginPage requirements & scenarios
- `specs/dashboard-page-object/spec.md` – DashboardPage requirements & scenarios
- `specs/transfer-page-object/spec.md` – TransferPage requirements & scenarios

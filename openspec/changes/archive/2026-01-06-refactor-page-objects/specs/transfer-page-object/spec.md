# Spec: TransferPage Object

## ADDED Requirements

### Requirement: TransferPage class SHALL encapsulate quick payment form
**Status**: New  
**Priority**: P0 (Critical)  
**Category**: Test Infrastructure

The TransferPage class SHALL centralize all quick payment form interactions and form field resolution logic.

#### Scenario: TransferPage resolves form fields with heuristic strategy
- Form fields (amount, title) are resolved by nearby text labels (e.g., "kwota", "tytu")
- Field resolution logic from `formUtils.getFieldByNearbyText()` is integrated into TransferPage
- Encapsulated as private methods; tests access via public actions
- Handles multiple form field strategies (input inside, following input, select fallback)

#### Scenario: TransferPage provides form field interaction methods
- `selectRecipient(index: number): Promise<void>` – selects recipient by option index
- `fillAmount(amount: string): Promise<void>` – fills amount field with heuristic location
- `fillTitle(title: string): Promise<void>` – fills title field with heuristic location
- `fillTransferForm(recipientIndex: number, amount: string, title: string): Promise<void>` – convenience method for all three
- All methods handle DOM element type checking (input vs select detection)

#### Scenario: TransferPage provides verification methods
- `verifyFormFieldsVisible(): Promise<void>` – confirms recipient combobox, amount, title, execute button visible
- `verifyExecuteButtonEnabled(): Promise<void>` – checks execute button is enabled
- `verifyTransferPageLoaded(): Promise<void>` – waits for transfer page URL and form elements

#### Scenario: TransferPage provides transfer action
- `clickExecute(): Promise<void>` – clicks the execute/submit button
- `submitTransfer(recipientIndex: number, amount: string, title: string): Promise<void>` – convenience method: fill + click

#### Scenario: TransferPage constructor accepts Playwright page
- Constructor: `constructor(page: Page)`
- Stores page instance
- No direct `page` property exported

---

## MODIFIED Requirements

### Requirement: TransferPage MUST migrate formUtils heuristic logic
**Status**: Change  
**Priority**: P1 (High)

The `tests/helpers/formUtils.ts` contains `getFieldByNearbyText()` function with complex XPath and fallback logic. This logic MUST move into TransferPage as private helpers.

#### Scenario: Form field finding preserves existing heuristic strategies
- Strategy 1: input inside element containing text → use if found
- Strategy 2: textarea inside element containing text → use if found
- Strategy 3: input following element containing text → use if found
- Strategy 4: select inside element (fallback) → use if found
- Strategy 5: union fallback → use if nothing else found
- Case-insensitive text search preserved

#### Scenario: Type checking and field adaptation preserved
- Code detects if returned element is `<select>` when `<input>` expected
- Falls back to next strategy if type mismatch
- Prevents brittle test failures from unexpected DOM structure

---

## REMOVED Requirements

### Requirement: Direct form field access in transfer tests
**Status**: Removed  
**Priority**: N/A

Tests no longer call `getFieldByNearbyText()` or `page.getByRole('combobox')` directly.
- All form field location is private to TransferPage
- Tests use semantic methods: `transferPage.fillAmount()`, `transferPage.clickExecute()`

### Requirement: formUtils helper file (public form utilities)
**Status**: Removed  
**Priority**: N/A

`tests/helpers/formUtils.ts` no longer needed as standalone helper.
- Logic integrates into TransferPage as private methods
- If other page objects need similar logic, extract shared utility into BasePage

---

## Implementation Notes

- **File**: `tests/pages/TransferPage.ts`
- **Extends**: BasePage
- **Depends on**: Playwright Page, form field heuristic logic
- **TypeScript**: Strict mode, full type coverage
- **Async/await**: All public methods async

## Related Pages

- DashboardPage (user navigates from dashboard to transfer)
- LoginPage (user must be logged in)
- BasePage (shared waits and utilities)

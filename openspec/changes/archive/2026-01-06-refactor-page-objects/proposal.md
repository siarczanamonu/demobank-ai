# Proposal: Refactor Tests to Page Object Model

**Change ID**: refactor-page-objects  
**Status**: Completed  
**Author**: Refactoring Initiative  
**Date**: January 6, 2026

## Why

The current test suite lacks a standardized pattern for organizing UI interactions. Locators and element access logic are scattered throughout test files, making tests brittle and difficult to maintain. When the UI changes, the impact ripples across multiple test files. Page Object Model establishes a clear contract between tests and UI, centralizing all UI knowledge in dedicated classes. This improves maintainability, readability, and reduces duplication.

## Summary

Refactor the existing Playwright test suite to adopt the Page Object Model (POM) pattern across all test files. Currently, tests scatter DOM locators and interactions throughout spec files, reducing maintainability and increasing duplication. Introducing dedicated Page Object classes will centralize UI element access, improve test readability, and make future UI changes easier to manage.

## Current State

**Test Files**: 
- `tests/login.spec.ts` – direct Playwright API calls with test IDs
- `tests/dashboard.spec.ts` – mixed role-based and heuristic locators
- `tests/transfer.spec.ts` & `tests/transfer.heuristic.spec.ts` – complex form interactions using custom helpers
- `tests/example.spec.ts` & `tests/seed.spec.ts` – various automation patterns

**Helpers**:
- `tests/helpers/loginHelper.ts` – partial abstraction (uiLogin function)
- `tests/helpers/formUtils.ts` – utility for finding form fields by nearby text
- `tests/helpers/getAuth.ts` – authentication credential loading

**Issues**:
1. DOM locators embedded directly in test code (brittle, hard to update)
2. Partial abstractions (only login has a helper)
3. Duplicate locator strategies across tests
4. No standardized way to model page structure
5. Complex workarounds for form finding (heuristic/fallback logic)

## Proposed Solution

Introduce **Page Object Classes** in `tests/pages/` directory, one per major page:

1. **LoginPage** – encapsulate login form locators and login action
2. **DashboardPage** – encapsulate dashboard elements (balance, recent transactions, logout)
3. **TransferPage** – encapsulate quick payment form with recipient, amount, title fields

Each page object will:
- Expose public methods for user actions (e.g., `fillAmount()`, `clickExecute()`)
- Encapsulate all locators (no direct test-level access to `page.getByTestId()` etc.)
- Handle common waits and error handling
- Keep form field lookup logic centralized

## Scope

**Included**:
- Create three core Page Objects (LoginPage, DashboardPage, TransferPage)
- Migrate all test files to use Page Objects
- Move and adapt existing helpers into Page Objects as internal methods
- Update TypeScript configuration/eslint if needed for new folder structure

**Not Included**:
- Rewriting test logic itself (only refactoring to use POM)
- Changes to CI/CD or test reporting
- New test cases
- Performance optimizations beyond what POM naturally provides

## Benefits

| Aspect | Current | With POM |
|--------|---------|----------|
| **Maintainability** | Brittle – DOM changes ripple through multiple files | Centralized – one change per locator |
| **Readability** | Scattered locators & actions | Clear, semantic method names |
| **Reusability** | Limited (partial helpers) | High – page methods used across specs |
| **Onboarding** | High learning curve | Clear structure, easy to extend |

## Design Decisions

1. **Class-based (not static)** – instances per test allow state if needed
2. **Strict encapsulation** – no public `page` property; all DOM access via methods
3. **Async/await** – preserve Playwright async patterns
4. **Co-locate with tests** – keep page objects in `tests/pages/` for easy discovery
5. **Minimal dependencies** – page objects only depend on Playwright types

## What Changes

### Added
- `tests/pages/BasePage.ts` – abstract base class providing common utilities
- `tests/pages/LoginPage.ts` – page object for login form interactions
- `tests/pages/DashboardPage.ts` – page object for dashboard elements and logout
- `tests/pages/TransferPage.ts` – page object for quick payment form with heuristic field resolution
- `tests/pages/index.ts` – centralized exports for all page objects

### Modified
- `tests/login.spec.ts` – refactored to use LoginPage
- `tests/dashboard.spec.ts` – refactored to use DashboardPage
- `tests/transfer.spec.ts` – refactored to use TransferPage
- `tests/transfer.heuristic.spec.ts` – refactored to use TransferPage

### Removed
- `tests/helpers/loginHelper.ts` – migrated logic into LoginPage
- `tests/helpers/formUtils.ts` – migrated logic into TransferPage

## Design Decisions

1. **Class-based (not static)** – instances per test allow state if needed
2. **Strict encapsulation** – no public `page` property; all DOM access via methods
3. **Async/await** – preserve Playwright async patterns
4. **Co-locate with tests** – keep page objects in `tests/pages/` for easy discovery
5. **Minimal dependencies** – page objects only depend on Playwright types

## Next Steps

1. ✅ Validate proposal with stakeholders
2. Proceed to `design.md` and spec delta creation (see `specs/*/spec.md`)
3. Approve and proceed to implementation phase
4. Execute tasks in `tasks.md` sequentially

---

For detailed implementation specs per page, see:
- [Login Page Object Spec](specs/login-page-object/spec.md)
- [Dashboard Page Object Spec](specs/dashboard-page-object/spec.md)
- [Transfer Page Object Spec](specs/transfer-page-object/spec.md)

For implementation roadmap, see `tasks.md`.

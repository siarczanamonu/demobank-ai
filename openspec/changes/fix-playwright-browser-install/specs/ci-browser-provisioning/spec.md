# Specification: CI Browser Provisioning

**ID**: `ci-browser-provisioning`  
**Version**: 1.0  
**Status**: Proposed

## Purpose
Define how Playwright browser executables are reliably provisioned in GitHub Actions CI environment so tests can execute successfully without "Executable doesn't exist" errors.

## Requirements

This section collects the formal requirements for the `ci-browser-provisioning` capability.

## ADDED Requirements

### Requirement: Explicit Browser Installation in CI
**ID**: `ci-browser-prov-req-001`

CI workflow MUST explicitly install Playwright browsers before test execution.

#### Scenario: Browser installation step executes
**Given** GitHub Actions workflow runs on `npm ci` completion  
**When** the "Install Playwright Browsers" step executes  
**Then** the step SHALL run `npx playwright install` command  
And the command SHALL download Chromium, Firefox, and WebKit binaries  
And the binaries SHALL be cached in `/home/runner/.cache/ms-playwright/`  
And the step SHALL complete without errors

---

### Requirement: Browser Installation Step Placement
**ID**: `ci-browser-prov-req-002`

Browser installation step MUST be positioned after dependency installation and before test execution.

#### Scenario: Workflow step order is correct
**Given** GitHub Actions workflow structure  
**When** workflow steps are ordered sequentially  
**Then** "Install dependencies" (`npm ci`) step SHALL execute first  
And "Install Playwright Browsers" step SHALL execute immediately after  
And "Run Playwright tests" step SHALL execute after browser installation  
And no test execution step SHALL precede browser installation

---

### Requirement: No Executable Not Found Errors
**ID**: `ci-browser-prov-req-003`

Playwright test execution SHALL NOT fail with "Executable doesn't exist" errors.

#### Scenario: Tests launch browsers successfully
**Given** CI workflow has completed browser installation  
**When** `npx playwright test` executes  
**Then** Playwright SHALL successfully launch browser processes  
And the test shall not encounter "browserType.launch: Executable doesn't exist" errors  
And tests SHALL proceed to execution phase

---

### Requirement: Browser Cache Efficiency
**ID**: `ci-browser-prov-req-004`

Browser binaries SHALL be cached by GitHub Actions to minimize re-download on subsequent runs.

#### Scenario: Browser cache is reused
**Given** previous workflow run installed and cached browsers  
**When** new workflow run executes  
**Then** GitHub Actions cache restoration SHALL occur automatically  
And browser re-download time SHALL be minimal (< 2 minutes)  
And step shall use cached browsers when available

---

### Requirement: Compatibility with Existing Configuration
**ID**: `ci-browser-prov-req-005`

Browser installation MUST NOT conflict with existing `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` environment variable.

#### Scenario: Environment variables work together
**Given** workflow sets `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'`  
**When** `npm ci` executes followed by `npx playwright install`  
**Then** `npm ci` SHALL skip browser downloads (as configured)  
And `npx playwright install` SHALL explicitly download browsers  
And both steps SHALL work without conflicts

---

## MODIFIED Requirements

None. This is a new capability; no existing requirements are changed.

## REMOVED Requirements

None. This is a new capability; no existing requirements are removed.

---
- Related capability: `ci-credentials` (credentials provisioning)
- Related capability: `ci-workflow` (GitHub Actions workflow framework)
- Playwright documentation: https://playwright.dev/docs/ci

## Validation Checklist
- [ ] Browser installation step added to `.github/workflows/ci.yml`
- [ ] Step positioned after `npm ci` and before test execution
- [ ] GitHub Actions workflow runs successfully
- [ ] All Playwright tests execute without "Executable doesn't exist" errors
- [ ] Browser cache is preserved between CI runs
- [ ] No conflicts with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` setting

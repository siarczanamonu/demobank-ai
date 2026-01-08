# Proposal: Fix Playwright Browser Installation in CI

## Summary
Resolve the GitHub Actions CI failure caused by missing Playwright browser executables. The workflow currently skips browser downloads during `npm ci` but does not explicitly install them, causing tests to fail with "Executable doesn't exist" error for chrome-headless-shell.

## Problem Statement
Current CI workflow configuration:
- Sets `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'` environment variable
- Does NOT run `npx playwright install` to provision browsers
- Result: Playwright tests fail when attempting to launch browsers

Error in CI logs:
```
Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell
```

## Goals
- Enable Playwright tests to execute successfully in GitHub Actions CI
- Properly provision Chromium, Firefox, and WebKit browsers before tests run
- Maintain reproducible, deterministic test environments

## Proposed Solution
Add explicit browser installation step to CI workflow:
1. After `npm ci` installs Node dependencies
2. Before test execution begins
3. Run `npx playwright install` to download and cache browser binaries

This ensures browsers are installed regardless of npm cache state and aligns with Playwright best practices for CI environments.

## Implementation Strategy
- Add new step: `Install Playwright Browsers` 
- Position: After `npm ci`, before `npm run typecheck`
- Command: `npx playwright install`
- Rationale: Keeps all setup steps together in logical sequence

## Success Criteria
- ✅ GitHub Actions workflow executes without "Executable doesn't exist" errors
- ✅ All Playwright tests run and complete (pass/fail based on test logic, not environment issues)
- ✅ No impact to local development workflow
- ✅ CI execution time remains acceptable

## Testing Strategy
- Push code changes to feature branch
- Trigger GitHub Actions workflow
- Verify workflow completes successfully
- Confirm test results are valid

## Timeline
Straightforward one-line fix. Estimated: 15 minutes to implement and validate.

## Risks & Mitigations
| Risk | Severity | Mitigation |
|------|----------|-----------|
| Extended CI execution time | Low | Browser caching in GitHub Actions runners mitigates |
| Browser version mismatches | Low | Playwright manages versions consistently across environments |
| Parallel workflow caching issues | Low | GitHub Actions handles cache correctly for serial execution |

## Related Work
- Previously implemented: `add-secure-ci-credentials` (credentials provisioning)
- Related: CI infrastructure improvements for test execution reliability

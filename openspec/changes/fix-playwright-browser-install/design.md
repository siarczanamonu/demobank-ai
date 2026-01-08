# Design: Playwright Browser Installation in CI

## Problem Analysis

### Root Cause
The workflow configuration contains a contradiction:
```yaml
env:
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'  # Skip during npm ci
# BUT no explicit npx playwright install step follows
```

When `npm ci` runs, it skips downloading Playwright browser binaries (by design—this is fast). However, the workflow never explicitly installs them before tests execute, leaving the browser cache empty.

### Dependency Chain
```
npm ci (dependencies installed, browsers SKIPPED)
  ↓
npm run typecheck (runs successfully, no browsers needed)
  ↓
npm run lint (runs successfully, no browsers needed)
  ↓
npx playwright test (FAILS - browsers not available)
```

## Solution Architecture

### Option A (Recommended): Add `npx playwright install` step
**Pros:**
- Explicit browser provisioning
- Clear intent in workflow YAML
- Works consistently across CI environments
- Aligns with Playwright documentation
- Minimal overhead (browsers cached by runner)

**Cons:**
- Adds one more workflow step
- Slight time increase (usually ~30-60s on fresh runner)

### Option B: Remove `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD`
**Pros:**
- Simpler—fewer workflow steps
- Lets npm install browsers during `npm ci`

**Cons:**
- Mixes concerns (npm dependency install vs browser provisioning)
- Harder to debug/modify later
- More output noise during npm ci

### Option C: Move to Playwright Docker image
**Pros:**
- Complete pre-configured environment

**Cons:**
- Overkill for current setup
- Adds maintenance overhead
- Out of scope for this fix

**Selected: Option A** (explicit `npx playwright install` step)
- Clear intent
- Aligns with Playwright best practices
- Minimal implementation

## Implementation Plan

### Workflow Step Addition
Position: After `npm ci`, before `npm run typecheck`

```yaml
- name: Install Playwright Browsers
  run: npx playwright install
```

**Why this position:**
1. Dependencies must be available first (`npm ci`)
2. Browsers must exist before typecheck/lint (in case they reference Playwright APIs)
3. Browsers must exist before test execution (critical)

### Execution Flow (Updated)
```
Checkout
  ↓
Setup Node.js
  ↓
Generate auth.json (from secrets)
  ↓
npm ci (install dependencies, skip browsers)
  ↓
npx playwright install (NEW: install browsers explicitly)
  ↓
npm run typecheck
  ↓
npm run lint
  ↓
npx playwright test (browsers now available)
  ↓
Generate reports
```

## Performance Considerations

### Cold Start (No Cache)
- First run downloads all browsers: ~2-3 minutes
- Subsequent runs use GitHub Actions cache: ~30-60 seconds

### GitHub Actions Runner Behavior
- Runners include built-in caching for common tools
- Playwright browser caches are typically preserved between runs
- Caching is automatic and requires no additional configuration

### Cost-Benefit
- **Cost**: ~30-60 seconds per CI run (negligible)
- **Benefit**: Tests run successfully without environment errors (critical)

## Backwards Compatibility
- No changes to test code required
- No changes to local development workflow
- CI-only modification
- Existing Playwright cache handling remains unchanged

## Future Enhancements
- Consider `@playwright/test install` alternative (newer Playwright versions)
- Monitor browser cache efficiency in GitHub Actions
- Document best practices for team

# Proposal: Fix GitHub Actions CI/CD Pipeline

**Change ID**: fix-github-actions  
**Status**: Proposal  
**Author**: Refactoring Initiative  
**Date**: January 6, 2026

## Why

The GitHub Actions CI/CD pipeline is currently failing with error: "Dependencies lock file is not found". The workflow file (`ci.yml`) configures npm caching and uses `npm ci` for deterministic dependency installation, but the `package-lock.json` file is not tracked in the git repository. This causes CI runs to fail whenever the workflow attempts to restore cached dependencies. Lock files are essential for reproducible builds and should be committed to the repository as best practice.

## Summary

The GitHub Actions workflow (`ci.yml`) cannot run successfully because the npm dependency lock file (`package-lock.json`) is missing from the repository, even though it exists locally. The workflow fails at the dependency installation step when it tries to use caching with `cache: 'npm'`. This prevents all CI/CD jobs (linting, type checking, tests) from executing. The fix involves committing the `package-lock.json` file to the repository and ensuring the workflow is properly configured to use cached dependencies.

## Current State

**CI/CD Configuration**:
- Workflow file: `.github/workflows/ci.yml`
- Workflow triggers: push to `main`/`master`, pull requests
- Node version: 18.x
- Dependency management: npm with caching enabled
- Current steps: 
  1. Checkout code
  2. Setup Node.js with npm caching
  3. Install dependencies (`npm ci`)
  4. Run TypeScript type checking
  5. Run ESLint linting
  6. Run Playwright tests

**Issues**:
1. GitHub Actions reports: "Dependencies lock file is not found in `/home/runner/work/demobank-ai/demobank-ai`. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock"
2. File `package-lock.json` exists locally but is not tracked in git
3. Workflow cannot use npm cache layer without lock file present
4. CI/CD pipeline is blocked from execution

## Proposed Solution

**Phase 1: Add Lock File to Repository**
- The `package-lock.json` file SHALL be committed to git repository
- The lock file SHALL reflect current dependency state (pinned versions)
- Documentation of lock file SHALL be provided for reproducible builds

**Phase 2: Verify Workflow Configuration**
- The `ci.yml` workflow configuration SHALL be confirmed to properly configure npm caching
- Workflow execution SHALL be tested in CI environment
- All CI steps SHALL complete successfully (lint, typecheck, tests)

## Scope

**Included**:
- Add `package-lock.json` to git tracking
- Verify workflow configuration in `ci.yml`
- Test CI pipeline execution
- Document dependency management best practices

**Not Included**:
- Upgrading npm or Node.js versions (separate proposal if needed)
- Adding new CI steps (e.g., code coverage, performance tests)
- Migrating to other package managers (yarn, pnpm)

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **CI Pipeline** | Fails on dependency caching | Runs successfully with cached deps |
| **Build Reproducibility** | Inconsistent (varies by local env) | Consistent (pinned versions) |
| **CI Performance** | Blocked | Fast with cache hits |
| **Dependency Management** | Implicit (only package.json) | Explicit (with lock file) |
| **Team Collaboration** | Uncertainty about exact versions | Guaranteed same versions for all |

## Design Decisions

1. **Use npm lock file** (not yarn or pnpm) – aligns with current tooling in `package.json`
2. **Commit lock file** (not gitignore) – required for reproducible CI builds
3. **No dependency updates** – only committing existing lock file; upgrades handled separately
4. **Standard GitHub Actions caching** – use built-in `cache: 'npm'` without custom configuration

## What Changes

### Added
- `package-lock.json` file SHALL be committed to repository to track exact dependency versions

### Modified
- `.gitignore` MAY be modified to remove any exclusion of `package-lock.json` if present (ensuring file is tracked)

### Removed
- None

---

For detailed implementation specs, see:
- [Dependencies Lock File Spec](specs/dependencies-lock/spec.md)

For implementation roadmap, see `tasks.md`.

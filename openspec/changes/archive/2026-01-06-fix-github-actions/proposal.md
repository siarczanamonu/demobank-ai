# Proposal: Fix GitHub Actions CI/CD Pipeline

**Change ID**: fix-github-actions  
**Status**: Proposal  
**Author**: Refactoring Initiative  
**Date**: January 6, 2026

## Why

The GitHub Actions CI/CD pipeline is currently failing with error: "Dependencies lock file is not found". This error SHALL be resolved by committing the `package-lock.json` file to the repository. The workflow file (`ci.yml`) configures npm caching and uses `npm ci` for deterministic dependency installation, but the `package-lock.json` file is not tracked in the git repository. This causes CI runs to fail whenever the workflow attempts to restore cached dependencies. Lock files SHALL be committed to the repository as best practice for reproducible builds.

## Summary

The GitHub Actions workflow (`ci.yml`) cannot run successfully because the npm dependency lock file (`package-lock.json`) is missing from the repository, even though it exists locally. The solution SHALL involve committing the `package-lock.json` file to the repository and ensuring the workflow is properly configured to use cached dependencies. The workflow fails at the dependency installation step when it tries to use caching with `cache: 'npm'`. This prevents all CI/CD jobs (linting, type checking, tests) from executing.

## Current State

**CI/CD Configuration**:
- Workflow file SHALL be: `.github/workflows/ci.yml`
- Workflow triggers SHALL include: push to `main`/`master`, pull requests
- Node version SHALL be: 18.x
- Dependency management SHALL use: npm with caching enabled
- Current steps SHALL be: 
  1. Checkout code
  2. Setup Node.js with npm caching
  3. Install dependencies (`npm ci`)
  4. Run TypeScript type checking
  5. Run ESLint linting
  6. Run Playwright tests

**Issues**:
1. GitHub Actions SHALL report: "Dependencies lock file is not found in `/home/runner/work/demobank-ai/demobank-ai`. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock"
2. File `package-lock.json` SHALL exist locally but not be tracked in git
3. Workflow SHALL not be able to use npm cache layer without lock file present
4. CI/CD pipeline SHALL be blocked from execution

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
- The `package-lock.json` file SHALL be added to git tracking
- Workflow configuration in `ci.yml` SHALL be verified
- CI pipeline execution SHALL be tested
- Dependency management best practices SHALL be documented

**Not Included**:
- Upgrading npm or Node.js versions (separate proposal if needed)
- Adding new CI steps (e.g., code coverage, performance tests)
- Migrating to other package managers (yarn, pnpm)

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **CI Pipeline** | Pipeline fails on dependency caching | Pipeline SHALL run successfully with cached deps |
| **Build Reproducibility** | Builds are inconsistent (varies by local env) | Builds SHALL be consistent (pinned versions) |
| **CI Performance** | Pipeline is blocked | Pipeline SHALL run fast with cache hits |
| **Dependency Management** | Dependencies are implicit (only package.json) | Dependencies SHALL be explicit (with lock file) |
| **Team Collaboration** | There is uncertainty about exact versions | Team SHALL have guaranteed same versions for all |

## Design Decisions

1. **Use npm lock file** – The project SHALL use npm lock file (not yarn or pnpm) to align with current tooling in `package.json`
2. **Commit lock file** – The lock file SHALL be committed (not in gitignore) as it is required for reproducible CI builds
3. **No dependency updates** – Only the existing lock file SHALL be committed; upgrades are handled separately
4. **Standard GitHub Actions caching** – The project SHALL use built-in `cache: 'npm'` without custom configuration

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

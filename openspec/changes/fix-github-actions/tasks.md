# Tasks: Fix GitHub Actions CI/CD Pipeline

## Overview

Fix GitHub Actions CI/CD pipeline by committing the npm dependency lock file to the repository. This unblocks all CI jobs (linting, type checking, tests) and enables npm caching for faster builds.

## Sequencing Notes

- **Task 1-2**: Independent (can be done in parallel if desired)
- **Task 3-4**: Sequential – verification depends on lock file being committed
- **Total Time**: ~30 minutes

---

## Task 1: Verify Lock File Integrity Locally

**Dependency**: None  
**Parallel**: Yes (can be done anytime)

**Objective**: Ensure `package-lock.json` is in sync with `package.json` before committing to repository.

**Steps**:
1. Remove `node_modules/` directory to ensure clean install
   ```bash
   rm -rf node_modules/
   ```
2. Run clean install to regenerate lock file
   ```bash
   npm ci
   ```
3. Verify no changes to `package-lock.json`
   ```bash
   git diff package-lock.json
   ```
   - Expected: No output (file unchanged) or minimal changes
   - If large changes: investigate and document
4. Verify all dependencies installed correctly
   ```bash
   npm list --depth=0
   ```
   - Expected: All packages listed with correct versions
   - No warnings or ERRORs

**Validation**:
- ✅ `node_modules/` exists and contains all packages
- ✅ `npm list` shows all dependencies without errors
- ✅ `package-lock.json` is consistent with `package.json`

---

## Task 2: Verify Lock File is Not in .gitignore

**Dependency**: None  
**Parallel**: Yes (independent)

**Objective**: Ensure lock file won't be ignored when we try to commit it.

**Steps**:
1. Check if `.gitignore` excludes lock files
   ```bash
   grep -E "package-lock|lock file|\.lock" .gitignore
   ```
2. If lock file is in `.gitignore`:
   - Remove the exclusion rule
   - Example: remove lines like `package-lock.json` or `/node_modules/`
   - Keep `node_modules/` ignored (we only need lock file)
3. Verify change
   ```bash
   grep -E "package-lock" .gitignore
   ```
   - Expected: No output (rule removed)

**Validation**:
- ✅ `package-lock.json` is NOT in `.gitignore`
- ✅ `node_modules/` is still in `.gitignore` (or excluded)
- ✅ `.gitignore` is updated in git tracking

**Note**: If `.gitignore` needs update, commit it in the same PR as lock file.

---

## Task 3: Add package-lock.json to Git and Commit

**Dependency**: Task 1 (lock file must be verified)  
**Parallel**: No (requires Task 1 complete)

**Objective**: Stage and commit the lock file to git repository.

**Steps**:
1. Stage lock file
   ```bash
   git add package-lock.json
   ```
2. Verify staging
   ```bash
   git status
   ```
   - Expected output:
     ```
     On branch fix-github-actions
     Changes to be committed:
       new file:   package-lock.json
     ```
3. Commit with descriptive message
   ```bash
   git commit -m "ci: add npm dependency lock file for reproducible builds

   - Add package-lock.json to enable GitHub Actions npm caching
   - Ensures deterministic dependency installation across CI/CD
   - Required for reproducible builds and faster CI performance
   - Lock file tracks exact versions of all transitive dependencies"
   ```
4. Verify commit
   ```bash
   git log -1 --stat
   ```
   - Expected: Shows commit with `package-lock.json` addition (~65KB)

**Validation**:
- ✅ Commit created with descriptive message
- ✅ `package-lock.json` is staged and committed
- ✅ Local git history shows commit

---

## Task 4: Push to Remote and Trigger CI Workflow

**Dependency**: Task 3 (commit must be created)  
**Parallel**: No (requires commit on remote)

**Objective**: Push changes to GitHub and verify CI pipeline runs successfully.

**Steps**:
1. Push to remote (assuming branch `fix-github-actions`)
   ```bash
   git push origin fix-github-actions
   ```
   - Expected: Branch updated on GitHub

2. If not already open, create PR on GitHub
   - Base: `main`
   - Compare: `fix-github-actions`
   - Title: "ci: fix GitHub Actions by adding dependency lock file"
   - Description: Reference this proposal (fix-github-actions)

3. Wait for GitHub Actions to trigger and monitor workflow
   - Navigate to `.github/workflows/ci.yml` in PR checks
   - Expected steps (all passing):
     - ✅ Checkout
     - ✅ Setup Node.js (with cache)
     - ✅ Install dependencies (npm ci)
     - ✅ TypeScript typecheck
     - ✅ ESLint linting
     - ✅ Run Playwright tests
   - Total time: 1-3 minutes

4. Verify cache in workflow logs (optional, advanced)
   - Click "Setup Node.js" step in workflow output
   - Look for lines indicating cache hit:
     - "Restored /home/runner/npm_cache" (first run: saves cache)
     - "Cache hit for npm" (subsequent runs: restores cache)

5. Check test results
   - All lint checks pass (ESLint: no errors)
   - TypeScript compilation succeeds (tsc --noEmit)
   - Playwright tests complete (10 passed expected)

**Validation**:
- ✅ Branch pushed to `origin/fix-github-actions`
- ✅ GitHub Actions workflow triggered successfully
- ✅ All CI jobs complete without errors
  - ✅ Setup Node.js + npm caching succeeds
  - ✅ `npm ci` installs dependencies
  - ✅ ESLint passes
  - ✅ TypeScript passes
  - ✅ Playwright tests pass
- ✅ No "lock file not found" error

---

## Task 5: Review and Merge PR

**Dependency**: Task 4 (CI must pass)  
**Parallel**: No (requires CI success)

**Objective**: Approve PR and merge to main branch.

**Steps**:
1. Request code review (if team process requires)
2. Once approvals received, merge PR to `main`
   - Use "Create a merge commit" option (preserves git history)
   - Delete branch after merge (cleanup)
3. Verify merge
   ```bash
   git log main --oneline | head -3
   ```
   - Expected: Latest commit is the merge commit with lock file

4. Pull latest main locally (optional, for verification)
   ```bash
   git checkout main
   git pull origin main
   ls -la package-lock.json
   ```
   - Expected: Lock file exists and is tracked

**Validation**:
- ✅ PR merged to `main`
- ✅ `package-lock.json` is in `main` branch
- ✅ Branch `fix-github-actions` deleted from remote
- ✅ All CI steps pass on main

---

## Success Criteria

- ✅ `package-lock.json` is committed and pushed to repository
- ✅ GitHub Actions workflow runs without "lock file not found" error
- ✅ All CI steps pass: lint, typecheck, tests
- ✅ npm caching is active (cache hit on subsequent runs)
- ✅ No merge conflicts or issues during PR process
- ✅ Team can now rely on reproducible CI builds

---

## Rollback Plan

If any issues arise:

1. **If lock file has wrong versions**:
   - Revert commit: `git revert <commit-sha>`
   - Regenerate lock file: `npm ci`
   - Create new commit with correct versions

2. **If CI still fails**:
   - Check workflow logs for specific error
   - Verify `package.json` and lock file are in sync
   - May need to investigate Node.js or npm versions

3. **If cache causes issues**:
   - Workflow has built-in cache clearing (time-based)
   - Manual cache clear in GitHub Actions UI available
   - Disable caching as last resort (modify `ci.yml` `cache: 'npm'`)

---

## Notes

- **Lock file size**: ~65KB (negligible impact on repository size)
- **CI performance gain**: First run 2-3 min, subsequent runs ~1 min (with cache)
- **Team communication**: Brief note to team about lock file in repo and using `npm ci` locally

# Design: GitHub Actions CI/CD Fix

## Problem Analysis

### Root Cause
The GitHub Actions workflow attempts to use npm caching (`cache: 'npm'`) but fails because GitHub Actions cannot find the dependency lock file. While `package-lock.json` exists in the local development environment, it is not tracked in the git repository (likely in `.gitignore` or simply never committed).

### Current Workflow Flow
```
1. actions/checkout@v4          ← Clones repository
2. actions/setup-node@v4        ← Sets up Node.js 18.x
   └─ cache: 'npm'              ← Tries to restore/use npm cache
      └─ ERROR: lock file not found!
3. npm ci                        ← BLOCKED (step 2 failed)
4. npm run typecheck            ← BLOCKED
5. npm run lint                 ← BLOCKED
6. npx playwright test          ← BLOCKED
```

### Why Lock Files Matter

**Local Development**:
- `npm install` generates `package-lock.json`
- Lock file contains pinned versions of all transitive dependencies
- Ensures same versions across team members

**CI/CD Pipeline**:
- Lock file MUST exist in repository
- GitHub Actions uses it to:
  1. Verify cache key (hash of lock file)
  2. Restore previously cached `node_modules/`
  3. Avoid re-downloading packages on every run
- `npm ci` reads lock file for deterministic installation

**Best Practice**:
- Lock files are always committed to version control
- Reduces `node_modules` size in cache
- Prevents "works on my machine" problems

## Solution Architecture

### File Structure
```
demobank-ai/
├── package.json               (existing - dependencies spec)
├── package-lock.json          ← ADD to git tracking
├── .github/
│   └── workflows/
│       └── ci.yml             (existing - already correct)
└── .gitignore                 (may need update)
```

### Workflow After Fix
```
1. actions/checkout@v4          ← Clones repository (includes lock file)
2. actions/setup-node@v4        ← Sets up Node.js 18.x
   └─ cache: 'npm'              ← Finds lock file, computes cache key
      ├─ First run: downloads packages, stores in cache
      └─ Next run: restores from cache (fast!)
3. npm ci                        ← Uses lock file, installs exact versions
4. npm run typecheck            ← TypeScript checks pass
5. npm run lint                 ← ESLint checks pass
6. npx playwright test          ← Tests run successfully
✅ All steps complete successfully
```

### Caching Strategy

**Cache Key Calculation**:
- GitHub Actions hashes `package-lock.json`
- Key format: `npm-cache-<hash>-<runner-os>`
- Cache saved to GitHub's cloud storage (per repository)

**Cache Hits**:
- Same lock file = same cache key = restored cache
- First run: ~2-3 minutes (download + cache)
- Subsequent runs: ~30-60 seconds (cache hit)

**Cache Invalidation**:
- Any change to `package-lock.json` invalidates cache
- Example: `npm install new-package`
- New packages downloaded, new cache created

## Risk Analysis

### Risk: Lock File Becomes Stale
**Impact**: Dependencies not updated regularly  
**Mitigation**:
- Establish dependency update policy (monthly/quarterly)
- Use Dependabot for automated security updates
- Include "Update dependencies" as separate task type

### Risk: Lock File Conflicts in Merges
**Impact**: PR conflicts when merging dependency changes  
**Mitigation**:
- Use `npm ci` locally (deterministic)
- Only `npm install` when deliberately updating
- Document workflow for team members

### Risk: Large Lock File in Repository
**Impact**: Slightly larger clone size (~65KB)  
**Mitigation**:
- 65KB is negligible (typical projects have larger code)
- Benefit (faster CI) outweighs storage cost
- No impact on CI/CD performance

## Implementation Sequence

1. **Verify lock file state locally**
   - Ensure `package-lock.json` reflects current `package.json`
   - Run `npm ci` to verify lock file integrity

2. **Add to git tracking**
   - Remove from `.gitignore` if present
   - Stage `package-lock.json`
   - Commit with message "ci: add npm dependency lock file"

3. **Push and verify CI**
   - Push changes to `origin`
   - Trigger GitHub Actions workflow
   - Verify all steps complete (lint, typecheck, tests)
   - Check cache logs in workflow output

4. **Document for team**
   - Update README or CONTRIBUTING.md
   - Clarify: use `npm ci` locally, not `npm install`
   - Explain lock file purpose and git workflow

## Comparison: Alternative Approaches

| Approach | Pros | Cons | Chosen |
|----------|------|------|--------|
| **Commit lock file (proposed)** | Standard practice, fast CI, reproducible | Slightly larger repo | ✅ YES |
| **Generate in CI** | No lock file in repo | Cache misses every run (slow) | ❌ No |
| **Use npm-shrinkwrap** | Alternative to lock file | npm recommends lock file | ❌ No |
| **Disable npm caching** | Simplest workaround | Slow CI (re-download every time) | ❌ No |
| **Switch to yarn/pnpm** | Different tooling | Breaking change, migration effort | ❌ No |

## Related Decisions

- **No tooling changes**: Stays with npm (no yarn/pnpm)
- **No version upgrades**: Node 18.x remains current selection
- **Standard caching**: Uses built-in GitHub Actions npm caching (no custom solutions)

---

## Success Criteria

- ✅ `package-lock.json` committed to repository
- ✅ GitHub Actions workflow runs without lock file errors
- ✅ All CI steps complete (lint, typecheck, tests)
- ✅ npm cache is used (verified in workflow logs)
- ✅ No performance regressions
- ✅ Team documentation updated

# Design: Secure CI Credentials Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│         GitHub Actions Workflow (ci.yml)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Checkout repository                             │
│  2. Setup Node.js                                   │
│  3. [NEW] Generate auth.json from GitHub Secrets    │
│     - Uses secrets.DEMO_BANK_LOGIN                  │
│     - Uses secrets.DEMO_BANK_PASSWORD               │
│     - Creates tests/auth.json at runtime            │
│  4. Install dependencies                            │
│  5. Run typecheck, lint, tests (uses auth.json)     │
│  6. Clean up (optional: remove auth.json)           │
│                                                     │
└─────────────────────────────────────────────────────┘

Secrets Storage (GitHub Repository Settings):
├─ DEMO_BANK_LOGIN (value: "11111111")
└─ DEMO_BANK_PASSWORD (value: "22222222")
   Restricted to: Repository collaborators only
   Not available to: Fork PRs (by default)
```

## Technical Decisions

### 1. Secret Naming Convention
- `DEMO_BANK_LOGIN` and `DEMO_BANK_PASSWORD`
- Rationale:
  - Clearly prefixed with application name (DEMO_BANK)
  - Descriptive names indicate purpose (LOGIN, PASSWORD)
  - Follows GitHub Secrets best practices
  - Easy to identify and audit

### 2. Runtime auth.json Generation
- **Method**: Create file via GitHub Actions workflow step using `echo` and JSON formatting
- **Location**: `tests/auth.json` (same as current local development)
- **Timing**: Before dependency installation (so it's available to any setup scripts)
- **Rationale**:
  - No modifications to source code required
  - Decouples credential provisioning from application logic
  - Maintains identical file structure as local development
  - Platform-independent (works on any runner OS)
  - Auth.json is already in .gitignore, so no accidental commits possible

### 3. Security Approach
- **GitHub Secrets Masking**: GitHub Actions automatically masks secret values in logs
- **Fork PR Protection**: Secrets not available to untrusted fork PRs by default
- **Access Control**: Secrets visible only to repository collaborators (configurable)
- **No Hardcoding**: Never embed credentials in workflow YAML
- **Immutable at Runtime**: Credentials injected as environment variables, not modified during workflow

### 4. Compatibility Strategy
- **Local Development**: Unchanged—developers continue using local `auth.json` or environment setup
- **CI Environment**: Secrets-based approach, local `auth.json` ignored in CI
- **Backward Compatibility**: Adding new mechanism doesn't break existing flows
- **Test Code**: No changes required to test code; `getAuth()` remains unchanged

### 5. Workflow Integration Point
Insert the generation step:
```yaml
- name: Install dependencies
  run: npm ci
```

After checkout but before npm ci, to ensure `auth.json` is available if any setup script references it.

Position: After node-version setup, before npm ci.

### 6. Error Handling
- If secrets are not configured, the step will fail with a clear message
- GitHub Actions will mark the workflow run as failed
- Clear error messaging in workflow logs guides repository maintainers to configure secrets

## Alternative Approaches Considered

### Option A: Environment Variables (Rejected)
- Pass credentials as env variables, modify `getAuth()` to read from env
- **Pros**: No file creation, pure env-based
- **Cons**: Requires code changes, breaks current local testing pattern, less flexible for future multi-user scenarios

### Option B: Load Secrets into Repository (Rejected)
- Store credentials in a private branch or artifact repository
- **Pros**: Centralized secret management
- **Cons**: Complex setup, introduces external dependency, harder to rotate secrets, not idiomatic GitHub Actions

### Option C: Docker Secrets Mount (Rejected)
- Use Docker secrets or mounted volumes
- **Pros**: Enterprise-grade security
- **Cons**: Overkill for simple test credentials, incompatible with GitHub-hosted runners without complexity

### Option D: Encrypted Secrets File in Repo (Rejected)
- Commit encrypted auth.json, decrypt in CI
- **Pros**: Reduces manual secret configuration
- **Cons**: Key management complexity, harder to rotate, security through obscurity, not best practice

**Selected**: Option chosen is file generation from GitHub Secrets (Option A variant with file-based approach):
- Minimal code changes (none to test code)
- Clear separation of concerns (CI infrastructure vs. test code)
- Leverages built-in GitHub Actions security
- Simplest to understand and maintain
- Familiar pattern for repository maintainers

## Data Flow

```
GitHub Secrets Storage
    ↓
Environment Variables in Step (secrets.*)
    ↓
Generate auth.json (via echo/cat)
    ↓
tests/auth.json available to test runner
    ↓
getAuth() reads from file as normal
    ↓
Tests execute with credentials
    ↓
GitHub Actions masks credentials in logs
    ↓
Workflow complete, credentials not persisted
```

## Security Boundaries

1. **Repository Level**
   - Secrets stored in GitHub repository settings
   - Access controlled by GitHub repository permissions
   - Visible to: Organization owners, repository admins, users with "Secrets" role

2. **Workflow Level**
   - Secrets injected as step environment variables
   - Only accessible within the specific workflow run context
   - Masked in all logs by GitHub Actions platform

3. **Test Execution Level**
   - Credentials in memory during test runtime
   - No persistence to disk after workflow completes
   - Automatic cleanup when workflow terminates

## Future Enhancements
- Credential rotation/expiration policies
- Multiple credential sets per environment (staging/production)
- Audit logging of secret access
- Integration with GitHub's Secret Scanning

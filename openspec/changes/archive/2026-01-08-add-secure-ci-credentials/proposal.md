# Proposal: Add Secure CI Credentials to GitHub Actions

## Summary
Implement secure credential management in GitHub Actions CI pipeline by storing authentication credentials (user: `11111111`, password: `22222222`) as encrypted GitHub Secrets, restricted to authorized repository collaborators only. This ensures test data is not exposed in workflow files or logs.

## Problem Statement
Currently, the Demo Bank testing suite reads authentication credentials from a local `auth.json` file. In CI environments (GitHub Actions), there is no secure mechanism to provide these credentials, posing a security risk:
1. Credentials cannot be stored in version control (security breach risk)
2. No way to provide credentials during CI runs without committing them
3. Tests in CI cannot execute properly without available credentials
4. Sensitive data could be accidentally exposed in logs or workflow definitions

## Goals
- Securely provide test credentials to GitHub Actions CI pipeline
- Restrict credential access to repository collaborators only  
- Prevent credential exposure in workflow files, logs, or version control
- Maintain backwards compatibility with local testing workflow
- Enable full test execution in CI without manual intervention

## Scope
This change affects:
1. **GitHub Actions Workflow** (`ci.yml`): Add step to create `auth.json` from GitHub Secrets
2. **CI Environment**: Inject credentials via GitHub Secrets (DEMO_BANK_LOGIN, DEMO_BANK_PASSWORD)
3. **Security**: Secrets automatically masked in logs by GitHub Actions

## Proposed Solution
1. Create GitHub Secrets for authentication credentials (organization/repo level)
2. Modify CI workflow to generate `auth.json` from GitHub Secrets at runtime
3. Ensure `auth.json` is never committed (already in `.gitignore`)
4. Add documentation for repository maintainers on secret setup

## Implementation Strategy
- Use GitHub Actions environment variables with `secrets.` context
- Generate `auth.json` dynamically during CI run before tests execute
- Secrets are only available to:
  - Public repository: Visible to all contributors when referenced in workflow
  - Private repository: Visible only to collaborators with repo access
  - Can be further restricted to specific environments or branches

## Non-Goals
- User authentication via OAuth or external services (out of scope)
- Credential rotation or expiration logic (future enhancement)
- Multi-environment credential management (e.g., staging/production)

## Success Criteria
- [ ] CI pipeline successfully reads credentials from GitHub Secrets
- [ ] `auth.json` is generated at runtime in CI workflow
- [ ] All tests pass with injected credentials
- [ ] Credentials are not visible in workflow logs or repository files
- [ ] Local development workflow remains unchanged
- [ ] Documentation for secret setup is provided to maintainers

## Risks & Mitigations
| Risk | Severity | Mitigation |
|------|----------|-----------|
| Secrets exposed in logs | High | GitHub Actions automatically masks known secrets in logs |
| Unauthorized access to secrets | High | GitHub Secrets restricted by repository permissions |
| Hardcoded credentials in workflow | High | Use GitHub Secrets context, never hardcode in YAML |
| PR branch access to secrets | Medium | GitHub Actions restricts secret access in PRs from forks by default |

## Testing Strategy
- Verify workflow creates valid `auth.json` in CI
- Confirm all tests execute successfully with injected credentials
- Validate credentials do not appear in workflow run logs
- Test that local `auth.json` (if present) does not interfere with CI flow

## Timeline
This is a straightforward CI configuration change. Estimated scope: 1-2 hours for complete implementation and validation.

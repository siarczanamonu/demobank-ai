# Specification: CI Credentials Provisioning

**ID**: `ci-credentials`  
**Version**: 1.0  
**Last Updated**: 2026-01-08  
**Status**: Proposed

## Purpose
Provide a machine-readable specification for securely provisioning CI credentials to the Playwright test suite using GitHub Actions secrets.

## Overview
This specification defines how authentication credentials are securely provisioned to the Playwright test suite running in GitHub Actions CI environment. It ensures credentials (Demo Bank user: `11111111`, password: `22222222`) are available to tests while remaining inaccessible to unauthorized parties and unexposed in version control.

## Requirements

This section collects the formal requirements for the `ci-credentials` capability. Refer to the ADDED Requirements below for concrete scenarios and acceptance criteria.



### Requirement: GitHub Secrets Configuration

The GitHub repository MUST define two encrypted secrets for authentication provisioning.

**ID**: `ci-credentials-req-001`

#### Scenario: Administrator creates GitHub Secrets
**Given** a repository maintainer has admin access to repository settings  
**When** they navigate to Settings → Secrets and variables → Actions  
**Then** they MUST create two repository secrets:
- Name: `DEMO_BANK_LOGIN` with value `11111111`
- Name: `DEMO_BANK_PASSWORD` with value `22222222`

And the secrets SHALL be encrypted at rest by GitHub  
And the secrets SHALL be masked in workflow run logs  
And only repository collaborators SHALL see secret names (not values)

---

### Requirement: auth.json Runtime Generation

GitHub Actions workflow MUST generate `auth.json` from secrets before test execution.

**ID**: `ci-credentials-req-002`

#### Scenario: Workflow generates auth.json from secrets
**Given** CI workflow runs on GitHub Actions  
**When** workflow step executes with access to `secrets.DEMO_BANK_LOGIN` and `secrets.DEMO_BANK_PASSWORD`  
**Then** a new step MUST create `tests/auth.json` with structure:
```json
{
  "login": "<value from DEMO_BANK_LOGIN>",
  "password": "<value from DEMO_BANK_PASSWORD>"
}
```

And the file SHALL be created before test execution begins  
And the file location SHALL be identical to local development (`tests/auth.json`)  
And file permissions SHALL allow test process to read it  
And the file content SHALL never be logged or exposed

---

### Requirement: Secrets Unavailable to Untrusted Sources

GitHub Actions platform SHALL ensure credentials are not accessible to untrusted PR workflows or external triggers.

**ID**: `ci-credentials-req-003`

#### Scenario: Fork PR does not receive secrets
**Given** a contributor creates a pull request from a forked repository  
**When** the CI workflow runs for that PR  
**Then** GitHub Actions SHALL NOT make secrets available to the workflow  
And the workflow SHALL fail safely with a clear error if credentials are required  
And repository maintainers MAY manually approve workflows if needed (GitHub Actions feature)

---

### Requirement: Backward Compatibility with Local Development

Local development workflow MUST continue functioning without changes to test code or configuration.

**ID**: `ci-credentials-req-004`

#### Scenario: Developer runs tests locally
**Given** a developer has a local `tests/auth.json` file with credentials  
**When** they execute `npm test` or `npx playwright test`  
**Then** `getAuth()` SHALL read from local `tests/auth.json` as before  
And no changes to authentication helper code SHALL be required  
And local development workflow SHALL NOT be affected by CI changes

---

### Requirement: Credentials Not Persisted in Repository

Credentials MUST NOT ever be committed to version control history.

**ID**: `ci-credentials-req-005`

#### Scenario: Verify auth.json not in git
**Given** workflow completes successfully  
**When** repository state is checked  
**Then** `tests/auth.json` SHALL be present in `.gitignore`  
And no credentials SHALL appear in git commit history  
And no workflow file SHALL contain hardcoded credentials  
And repository SHALL remain clean of sensitive data

---

### Requirement: Clear Documentation for Maintainers

Repository MUST include documentation for setting up GitHub Secrets.

**ID**: `ci-credentials-req-006`

#### Scenario: Maintainer follows setup guide
**Given** a repository maintainer reads project documentation  
**When** they follow credential setup instructions  
**Then** they SHALL be able to successfully configure GitHub Secrets  
And instructions MUST specify exact secret names and expected values  
And instructions MUST explain GitHub Secrets access control  
And instructions MUST clarify where to navigate in GitHub UI

---

## MODIFIED Requirements
None. This is a new capability; no existing requirements are changed.

---

## REMOVED Requirements
None. This is a new capability; no existing requirements are removed.

---

## Cross-References
- Related capability: `test-execution` (tests depend on credentials)
- Related capability: `ci-workflow` (workflow execution framework)
- GitHub Actions documentation: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## Validation Checklist
- [ ] GitHub Secrets created with correct names and values
- [ ] CI workflow step generates valid JSON in `tests/auth.json`
- [ ] All tests pass with injected credentials
- [ ] Credentials not visible in workflow run logs
- [ ] Local development unaffected
- [ ] `.gitignore` includes `tests/auth.json`
- [ ] Documentation complete and clear
- [ ] Fork PRs fail gracefully when credentials unavailable

---

## Open Questions
None. Specification is complete.

---

## Implementation Notes
- JSON generation can use `echo`, `cat`, or `tee` command
- Consider error handling if secrets are misconfigured
- Platform-independent command approach recommended (avoid shell-specific syntax)

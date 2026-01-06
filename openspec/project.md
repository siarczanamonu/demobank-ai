# Project Context

## Purpose
Automated end-to-end testing suite for Demo Bank (https://demo-bank.vercel.app), a sample banking application. The project aims to provide comprehensive test coverage for user workflows including authentication, transfers, and dashboard interactions. Tests are designed to run locally and in CI environments with reliable, maintainable test cases.

## Tech Stack
- **Framework**: Playwright v1.56.1
- **Language**: TypeScript 5.3.3
- **Runtime**: Node.js
- **Module System**: CommonJS
- **Linting**: ESLint 8.48.0 with TypeScript and Prettier support
- **CI/CD**: GitHub Actions (configured for automated test runs)

## Project Conventions

### Code Style
- **Language**: TypeScript with strict mode enabled
- **Formatting**: ESLint + Prettier (eslint-config-prettier for integration)
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **File Organization**: 
  - Test specs in `tests/` directory with `.spec.ts` extension
  - Helper utilities in `tests/helpers/` for reusable test logic
  - Config files at root level (playwright.config.ts, tsconfig.json)
- **Target**: ES2020 with CommonJS module output

### Architecture Patterns
- **Test Organization**: Page Object Model (helpers directory contains utilities like loginHelper, formUtils, getAuth)
- **Shared Utilities**: Authentication helpers, form interaction utilities, seed/setup fixtures
- **Configuration Management**: Environment-based (auth.json for credentials, env variables for CI)
- **Test Reporting**: HTML reports generated to `playwright-report/`

### Testing Strategy
- **Approach**: End-to-end testing with Playwright using Chromium, Firefox, and WebKit
- **Execution**: 
  - Local: Fully parallel execution across multiple workers
  - CI: Serial execution (1 worker) with 2 retries for flaky tests
  - No test.only allowed in CI (forbidOnly enforced)
- **Test Categories**:
  - Login tests (`login.spec.ts`)
  - Transfer functionality (`transfer.spec.ts`, `transfer.heuristic.spec.ts`)
  - Dashboard verification (`dashboard.spec.ts`)
  - Seeding/data setup (`seed.spec.ts`)
  - Example patterns (`example.spec.ts`)
- **Base URL**: https://demo-bank.vercel.app
- **Artifacts**: HTML reports and test result data in `test-results/` and `playwright-report/`

### Git Workflow
- **Branches**: Suggested structure: `main` (default), `feature/*`, `test/*`, `ci/*` for organizational clarity
- **Commits**: Use descriptive messages (e.g., `chore: initial import of demobank tests`)
- **Publishing**: Direct push to origin/main after validation
- **CI Integration**: Automated lint, typecheck, and test execution on push/PR

## Domain Context
- **Application**: Demo Bank - a sample financial application for testing banking workflows
- **Key Workflows**: User authentication, fund transfers between accounts, transaction history viewing
- **Test Data**: Uses seed tests for initial data setup; stores authentication credentials in auth.json
- **Environment**: Cloud-hosted at Vercel; tests run against live staging/production instance

## Important Constraints
- **Test Isolation**: Tests rely on seeding and cleanup to maintain isolation
- **Flakiness Management**: CI retries configured (2x) to handle timing-sensitive operations
- **Security**: auth.json contains credentials - should be .gitignored in production use
- **Parallel Execution**: Must handle concurrent browser instances for local testing
- **CI Limitations**: Serial execution requirement in CI to prevent resource contention

## External Dependencies
- **Application**: Demo Bank hosted at https://demo-bank.vercel.app
- **Browser Engines**: Chromium, Firefox, WebKit (managed by Playwright)
- **CI Service**: GitHub Actions (for automated test runs)
- **Package Registry**: npm/yarn for dependencies
- **Reporting**: Playwright's built-in HTML reporter for test results visualization

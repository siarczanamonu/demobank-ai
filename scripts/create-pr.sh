#!/usr/bin/env bash
set -euo pipefail

# Usage: run from repository root
# This script creates a feature branch, commits all current changes with COMMIT_MESSAGE.txt,
# pushes the branch to origin and (optionally) creates a PR using GitHub CLI (gh).

BRANCH="feature/ci-lint-test-fixes"

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit. Exiting."
  exit 1
fi

echo "Creating branch: $BRANCH"
git checkout -b "$BRANCH"

echo "Staging changes..."
git add .

echo "Committing with message from COMMIT_MESSAGE.txt"
if [ -f COMMIT_MESSAGE.txt ]; then
  git commit -F COMMIT_MESSAGE.txt
else
  git commit -m "chore: apply changes"
fi

echo "Pushing branch to origin..."
git push -u origin "$BRANCH"

if command -v gh >/dev/null 2>&1; then
  echo "Creating PR via GitHub CLI (gh)..."
  # Use the first line of COMMIT_MESSAGE.txt as the title
  TITLE=$(head -n 1 COMMIT_MESSAGE.txt)
  gh pr create --title "$TITLE" --body-file PR_DESCRIPTION.md
else
  echo "gh CLI not found. PR not created automatically."
  echo "Suggested PR title: $(head -n 1 COMMIT_MESSAGE.txt)"
  echo "Suggested command to create PR (with gh): gh pr create --title \"$(head -n 1 COMMIT_MESSAGE.txt)\" --body-file PR_DESCRIPTION.md"
fi

echo "Done."

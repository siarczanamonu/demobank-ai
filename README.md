# demobank-ai

Repozytorium z automatycznymi testami Playwright dla przykładowej aplikacji Demo Bank.

Co zawiera:
- testy Playwright w `tests/`
- helpery w `tests/helpers/`
- konfigurację Playwright `playwright.config.ts`

Cel repozytorium:
- szybkie uruchomienie testów end-to-end lokalnie i w CI
- łatwa diagnostyka niestabilnych testów (helpery, raporty)

Jak zainicjować lokalne repo i wypchnąć na GitHub (skrót):

1. Zainicjuj git w katalogu projektu:

```bash
git init
git add .
git commit -m "chore: initial import of demobank tests"
git branch -M main
```

2. Stwórz repozytorium zdalne na GitHub (np. `demobank-ai`) i dodaj remote:

```bash
git remote add origin git@github.com:<your-username>/demobank-ai.git
git push -u origin main
```

3. W CI (np. GitHub Actions) możesz już korzystać z workflow w `.github/workflows/ci.yml` (jeśli istnieje) aby uruchamiać lint/typecheck/testy.

Jeśli chcesz, mogę przygotować commit message i zasugerować strukturę gałęzi (feature/ test/ ci). Jeśli chcesz, mogę też wygenerować gotowy plik `CONTRIBUTING.md` lub `CHANGELOG.md`.

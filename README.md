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

## CI Credentials Setup (dla Maintainerów)

Aby testy mogły uruchamiać się w GitHub Actions, musisz skonfigurować GitHub Secrets z danymi logowania:

### Kroki konfiguracji:

1. Przejdź do ustawień repozytorium: **Settings → Secrets and variables → Actions**
2. Kliknij **New repository secret** i utwórz dwa sekrety:
   - **Nazwa:** `DEMO_BANK_LOGIN`  
     **Wartość:** `11111111`
   - **Nazwa:** `DEMO_BANK_PASSWORD`  
     **Wartość:** `22222222`

3. Sekrety będą automatycznie zamaskowane w logach GitHub Actions

### Bezpieczeństwo:

- Sekrety są widoczne tylko dla maintainerów repozytorium
- Pull requesty z forków nie mają dostępu do sekretów (ochrona przed nieuprawnionym dostępem)
- Wartości sekretów nigdy nie będą wyeksportowane z GitHub Actions
- Workflow automatycznie zamaskuje wartości w logach jako `[***]`

### Troubleshooting:

Jeśli testy nie mogą się zalogować w CI:
1. Sprawdź, czy oba sekrety (`DEMO_BANK_LOGIN` i `DEMO_BANK_PASSWORD`) zostały utworzone
2. Weryfikuj w GitHub Actions czy generowanie pliku `tests/auth.json` powiodło się
3. Sprawdź logi workflow - powinny być zamaskowane wartości sekretów

Jeśli chcesz, mogę przygotować commit message i zasugerować strukturę gałęzi (feature/ test/ ci). Jeśli chcesz, mogę też wygenerować gotowy plik `CONTRIBUTING.md` lub `CHANGELOG.md`.

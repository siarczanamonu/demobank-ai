# Logowanie

Założenia:
- Czysta sesja przeglądarki.
- Aplikacja dostępna pod baseURL z `playwright.config.ts`.
- Dane testowe: login `11111111`, hasło `22222222` (lub dowolne 8+ znaków).

Scenariusze:

1) Logowanie — happy path
- Kroki: wpisz poprawny login i hasło (min. 8 znaków), kliknij "Zaloguj".
- Oczekiwane: przekierowanie do dashboard, widoczne saldo i lista transakcji.

2) Logowanie — niepoprawne hasło (krótsze niż 8 znaków)
- Kroki: wpisz poprawny login i hasło krótsze niż 8 znaków, kliknij "Zaloguj".
- Oczekiwane: komunikat o błędzie "hasło ma min. 8 znaków". Note: Aplikacja akceptuje dowolne hasło o długości min. 8 znaków.

3) Walidacja pól (puste pola)
- Kroki: pozostaw pole login/hasło puste, kliknij "Zaloguj".
- Oczekiwane: brak reakcji lub brak komunikatu (obecna wersja demo nie wyświetla walidacji dla całkowicie pustych pól).

Wskazówki automatyzacyjne:
- Używaj `await page.goto('/')` jeśli `baseURL` jest ustawiony.
- Pobierz dane z `auth.json` lub z konfiguracji testu.

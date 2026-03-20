Moduł: Logowanie użytkownika

Założenia wstępne:
- Czysta sesja przeglądarki.
- Aplikacja pod baseURL.
- Dane: login 11111111, hasło 22222222.

LOG-TC-001: Happy path
Tagi: @login @smoke @happy
Kroki:
1. Otwórz stronę logowania (page.goto('/')).
2. Wpisz login: 11111111.
3. Wpisz hasło: 22222222.
4. Kliknij "Zaloguj".

Oczekiwane rezultaty:
- Przekierowanie do /dashboard.
- Widoczne: saldo i lista transakcji.
- Status: PASS jeśli wszystkie elementy obecne.

LOG-TC-002: Hasło zbyt krótkie
Tagi: @login @negative
Kroki:
1. Otwórz stronę logowania.
2. Wpisz login: 11111111.
3. Wpisz hasło: 1234567.
4. Kliknij "Zaloguj".

Oczekiwane rezultaty:
- Komunikat: "Hasło musi mieć min. 8 znaków".
- Brak logowania.

LOG-TC-003: Puste pola
Tagi: @login @negative
Kroki:
1. Otwórz stronę logowania.
2. Pozostaw pola puste.
3. Kliknij "Zaloguj".

Oczekiwane rezultaty:
- Brak komunikatu (zgodne z demo).

LOG-TC-004: Edge case – białe znaki
Tagi: @login @edge
Kroki:
- Jak TC-001, ale login/hasło z dodatkowymi spacjami.

Oczekiwane rezultaty:
- Trimowanie i sukces (weryfikacja).

LOG-TC-005: Edge case – znaki specjalne
Tagi: @login @edge
Kroki:
- Jak TC-001, hasło Pass@#$%12.

Oczekiwane rezultaty:
- Sukces logowania.

Wskazówki: Pobierz dane z configu; dodaj assertions w Playwright.

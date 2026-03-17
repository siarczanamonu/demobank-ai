Moduł: Sesja i bezpieczeństwo

Założenia wstępne:
- Użytkownik zalogowany.

SEC-TC-001: Wylogowanie i ochrona zasobów
Tagi: @security @smoke
Kroki:
1. Zaloguj się.
2. Kliknij "Wyloguj".
3. Spróbuj wrócić przyciskiem "Wstecz" lub wpisać URL dashboardu ręcznie.

Oczekiwane rezultaty:
- Przekierowanie na stronę logowania.
- Dostęp pod bezpośrednim adresem zablokowany.

SEC-TC-002: Manipulacja formularzem (CSRF basic)
Tagi: @security @edge
Kroki:
1. Próba modyfikacji ukrytych pól/tokenów przez DevTools przed wysłaniem.

Oczekiwane rezultaty:
- Serwer odrzuca nieautoryzowane żądania.
- Brak wycieku danych wewnętrznych.

SEC-TC-003: Weryfikacja stanu po odświeżeniu (wylogowanie)
Tagi: @security @smoke
Kroki:
1. Zaloguj się.
2. Kliknij "Wyloguj".
3. Odśwież stronę.

Oczekiwane rezultaty:
- Użytkownik nadal jest wylogowany (widoczna strona logowania).
- Brak dostępu do dashboardu bez ponownego logowania.

Wskazówki: Testy wymagają weryfikacji po stronie backendu lub kontroli nagłówków.

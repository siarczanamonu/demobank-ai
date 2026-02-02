# Sesja i bezpieczeństwo

1) Wylogowanie i ochrona zasobów
- Założenia: użytkownik zalogowany.
- Kroki: zaloguj się, wyloguj, spróbuj wejść na dashboard (back / URL).
- Oczekiwane: przekierowanie na login; dostęp do chronionych stron zablokowany.

2) CSRF / manipulacja formularzem (basic)
- Założenia: tester ma devtools.
- Kroki: zmodyfikuj ukryte pola/tokeny przed wysłaniem formularza.
- Oczekiwane: serwer odrzuca nieautoryzowane żądania; brak ujawnienia szczegółów wewnętrznych.

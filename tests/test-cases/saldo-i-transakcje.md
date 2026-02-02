# Przegląd salda i transakcji

Założenia:
- Użytkownik zalogowany (użyj danych z `auth.json`).

Scenariusz: Weryfikacja salda i historii transakcji
- Kroki: zaloguj się, sprawdź widoczność salda, otwórz listę transakcji.
- Oczekiwane: saldo widoczne i sensowne (nie `NaN`/puste); lista transakcji załadowana (nagłówki/pozycje). Uwaga: w obecnej wersji demo lista "ostatnie operacje" oraz historia są statyczne i nie odświeżają się dynamicznie po nowym przelewie.

Wskazówki:
- Dla stabilności testów rozważ konto testowe z ustalonym saldem lub seed danych.

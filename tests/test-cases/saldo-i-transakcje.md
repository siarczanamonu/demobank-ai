Moduł: Przegląd salda i transakcji

Założenia wstępne:
- Użytkownik zalogowany (dane z auth.json).

DSH-TC-001: Weryfikacja salda i historii transakcji
Kroki:
1. Zaloguj się.
2. Sprawdź widoczność salda.
3. Otwórz listę transakcji.

Oczekiwane rezultaty:
- Saldo widoczne i sensowne (nie NaN/puste).
- Lista transakcji załadowana (nagłówki/pozycje).
- Uwaga: historia w demo jest statyczna.

DSH-TC-002: Edge case – format waluty
Kroki:
1. Weryfikacja wyświetlania salda na dashboardzie.

Oczekiwane rezultaty:
- Wartość numeryczna obecna (np. w #money_value).
- Status: PASS jeśli liczba jest poprawnie wyświetlona.

Wskazówki: Dla stabilności rozważ konto testowe z ustalonym saldem.

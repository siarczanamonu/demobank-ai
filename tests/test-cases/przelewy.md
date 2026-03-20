Moduł: Przelewy

Założenia wstępne:
- Użytkownik zalogowany.
- Konto ma odpowiednie saldo (dla happy path).

TRN-TC-001: Przelew wewnętrzny – happy path
Tagi: @transfer @smoke @happy
Kroki:
1. Zaloguj się.
2. Otwórz formularz przelewu.
3. Wprowadź numer odbiorcy (np. 22222222).
4. Wprowadź kwotę: 10.00.
5. Wprowadź opis.
6. Potwierdź przelew.

Oczekiwane rezultaty:
- Potwierdzenie przelewu.
- Saldo pomniejszone o kwotę.
- Transakcja na liście historii.
- Status: PASS jeśli saldo i historia są poprawne.

TRN-TC-002: Przelew – niewystarczające środki
Tagi: @transfer @negative
Kroki:
1. Zaloguj się.
2. Otwórz formularz przelewu.
3. Wpisz kwotę większą niż saldo.
4. Spróbuj zatwierdzić.

Oczekiwane rezultaty:
- System pozwala na wykonanie przelewu (brak blokady w demo).
- Skutkuje ujemnym saldem.

TRN-TC-003: Edge case – kwota minimalna
Tagi: @transfer @edge
Kroki:
1. Wykonaj przelew na kwotę 0.01.

Oczekiwane rezultaty:
- Sukces transakcji.

TRN-TC-004: Edge case – kwota zero lub ujemna
Tagi: @transfer @edge
Kroki:
1. Próba przelewu na 0.00 lub -1.00.

Oczekiwane rezultaty:
- Weryfikacja blokady lub walidacji w UI.

TRN-TC-005: Edge case – XSS w tytule
Tagi: @transfer @security @edge
Kroki:
1. Wpisz w tytule: <script>alert('XSS')</script>.

Oczekiwane rezultaty:
- Brak wykonania skryptu (bezpieczeństwo).

Wskazówki: Użyj seedów danych; rozważ odwracalne operacje lub reset środowiska.

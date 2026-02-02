# Przelewy

Założenia:
- Użytkownik zalogowany; konto ma odpowiednie saldo (dla happy path).

1) Przelew wewnętrzny — happy path
- Kroki: zaloguj się, otwórz formularz przelewu, wprowadź numer odbiorcy (np. `22222222`), kwotę `10.00`, opis, potwierdź.
- Oczekiwane: potwierdzenie przelewu, saldo pomniejszone o kwotę, transakcja na liście historii.

2) Przelew — niewystarczające środki
- Kroki: wpisz kwotę większą niż saldo, spróbuj zatwierdzić.
- Oczekiwane: System pozwala na wykonanie przelewu, co skutkuje ujemnym saldem (brak blokady lub komunikatu o błędzie w obecnej wersji demo).

Wskazówki:
- Dla testów modyfikujących dane użyj seedów lub dedykowanych kont testowych; rozważ odwracalne operacje lub reset środowiska.

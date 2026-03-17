Moduł: Przypadki Negatywne i Krawędziowe (Ogólne)

Założenia wstępne:
- Użytkownik zalogowany (dla testów przelewów).

NEG-TC-001: Niepoprawny format danych
Kroki:
1. Wpisz znaki alfanumeryczne w polu numeru konta.

Oczekiwane rezultaty:
- Blokada wpisywania lub walidacja błędu.

NEG-TC-002: Długi opis (Max length)
Kroki:
1. Wpisz tekst > 200 znaków w tytule przelewu.

Oczekiwane rezultaty:
- Przycięcie tekstu lub komunikat o przekroczeniu limitu.

NEG-TC-003: Double Submit
Kroki:
1. Kliknij wielokrotnie przycisk "Przelej" w krótkim odstępie czasu.

Oczekiwane rezultaty:
- Tylko jedna transakcja zrealizowana.

NEG-TC-004: Odłączenie sieci
Kroki:
1. Rozłącz sieć podczas wysyłania przelewu.

Oczekiwane rezultaty:
- Czytelny komunikat "Błąd połączenia".
- Brak wykonania transakcji "w ciemno".

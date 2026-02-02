# Przypadki negatywne i krawędziowe

Krótka lista przypadków do przetestowania:
- Niepoprawny format numeru konta (znaki alfanumeryczne tam, gdzie powinien być numer).
- Długi tekst w polu opisu (sprawdź limit długości i walidację).
- Wielokrotne naciśnięcie przycisku "Przelej" (double submit) — ochrona przed duplikatem.
- Próba wykonania akcji bez uprawnień (np. dostęp do sekcji administracyjnej).
- Odłączenie sieci podczas wysyłania żądania — obsługa timeout/komunikat użytkownika.

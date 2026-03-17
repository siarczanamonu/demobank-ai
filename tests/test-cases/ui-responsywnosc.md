Moduł: UI i responsywność

Założenia wstępne:
- Aplikacja otwarta na różnych urządzeniach/viewportach.

UI-TC-001: Kontrola responsywności
Kroki:
1. Otwórz aplikację w widoku Desktop (np. 1280x800).
2. Zmień na Tablet (np. 768x1024).
3. Zmień na Mobile (np. 375x667).

Oczekiwane rezultaty:
- Pola i przyciski nadal czytelne.
- Elementy nie nachodzą na siebie.
- Menu hamburgerowe widoczne na Mobile.

Wskazówki: Użyj Playwright `devices` lub `viewportSize`.

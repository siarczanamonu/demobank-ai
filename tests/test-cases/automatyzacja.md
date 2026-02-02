# Automatyzacja (Playwright)

Wskazówki i uwagi:
- `playwright.config.ts` ustawia `baseURL` na `https://demo-bank.vercel.app` — używaj `await page.goto('/')`.
- Dane logowania można pobrać z `auth.json` lub przekazać jako konfigurację testów.
- Dla scenariuszy modyfikujących dane przygotuj seed lub użyj kont dedykowanych.
- Przy niestabilnym środowisku zaakceptuj dopuszczalne warianty zachowania (np. niestandardowe przekierowania) lub dodaj retryy z dobrze opisanym ryzykiem.

Sugestie plików testów (przykładowe):
- `tests/login.spec.ts`
- `tests/transfer.spec.ts`
- `tests/dashboard.spec.ts`

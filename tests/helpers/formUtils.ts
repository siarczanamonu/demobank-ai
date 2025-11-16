import { Page, Locator } from '@playwright/test';

/**
 * Znajdź pole input/textarea/select na podstawie pobliskiego tekstu.
 * Funkcja próbuje kolejno kilka strategii (input/textarea bezpośrednio wewnątrz,
 * input następujący po elemencie, a dopiero potem select), żeby uniknąć sytuacji
 * w której xpath-union zwraca inny element niż oczekiwany (np. select zamiast input).
 *
 * Uwaga: funkcja jest asynchroniczna, zwraca znaleziony Locator (pierwszy dopasowany)
 * lub locator, który prawdopodobnie będzie pusty (ostatni fallback). Testy powinny
 * użyć `await getFieldByNearbyText(page, 'kwota')`.
 */
export async function getFieldByNearbyText(page: Page, textFragment: string): Promise<Locator> {
  const search = textFragment.toLowerCase();

  const makeXpath = (inner: string) =>
    `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])${inner}`;

  // 1) input wewnątrz elementu zawierającego tekst
  const inputLocator = page.locator(makeXpath("//input")).first();
  if ((await inputLocator.count()) > 0) return inputLocator;

  // 2) textarea wewnątrz
  const textareaLocator = page.locator(makeXpath("//textarea")).first();
  if ((await textareaLocator.count()) > 0) return textareaLocator;

  // 3) input następujący po elemencie zawierającym tekst
  const followingInput = page.locator(makeXpath("/following::input[1]")).first();
  if ((await followingInput.count()) > 0) return followingInput;

  // 4) select wewnątrz (tylko jako fallback)
  const selectLocator = page.locator(makeXpath("//select")).first();
  if ((await selectLocator.count()) > 0) return selectLocator;

  // 5) ostateczny fallback - pusty locator (pierwszy element z unionu)
  const union = page.locator(
    `xpath=(//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//input | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//textarea | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])//select | (//*/descendant-or-self::*[contains(translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${search}")])/following::input[1]`,
  ).first();
  return union;
}

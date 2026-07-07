import { Page, Locator, expect, test } from '@playwright/test';

/**
 * CookieBanner – encapsulates the OneTrust / custom consent overlay on TUI.nl.
 *
 * Instantiate once and share via HomePage.cookieBanner.
 */
export class CookieBanner {
  readonly banner: Locator;
  readonly acceptBtn: Locator;

  constructor(private readonly page: Page) {
    this.banner = page.locator(
      '#onetrust-banner-sdk, ' +
      '[data-testid="cookie-banner"], ' +
      '.cookie-consent, ' +
      '#cookieConsent'
    );

    this.acceptBtn = page.locator(
      '#onetrust-accept-btn-handler, ' +
      '[data-testid="cookie-accept"], ' +
      'button:has-text("Alles accepteren"), ' +
      'button:has-text("Accepteer"), ' +
      'button:has-text("Akkoord"), ' +
      'button:has-text("Accept all")'
    );
  }

  /**
   * Clicks the accept button if the banner is visible, then waits for it to
   * disappear. Silently passes if the banner is absent (already dismissed or
   * not shown on this session).
   */
  async accept(): Promise<void> {
    await test.step('Accept the cookie consent banner', async () => {
      try {
        await this.acceptBtn.waitFor({ state: 'visible', timeout: 10_000 });
        await this.acceptBtn.click();
        await this.banner.waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => {});
        console.log('✓ Cookie banner accepted');
      } catch {
        console.log('ℹ Cookie banner not found or already dismissed');
      }
      await expect(this.banner).not.toBeVisible({ timeout: 5_000 }).catch(() => {});
    });
  }
}

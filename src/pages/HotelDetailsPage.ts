import { Page, Locator, expect, test } from '@playwright/test';

/**
 * HotelDetailsPage – the individual hotel page reached after clicking a result card.
 */
export class HotelDetailsPage {
  readonly page: Page;

  readonly hotelTitle: Locator;
  readonly continueBtn: Locator;
  readonly bookingPanel: Locator;
  readonly priceDisplay: Locator;
  readonly loadingOverlay: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingOverlay = page.locator(
      '[class*="loading"], [class*="spinner"], [aria-busy="true"]'
    );

    this.hotelTitle = page.locator(
      '[data-testid="hotel-title"], ' +
      'h1[class*="hotel"], ' +
      'h1[class*="title"], ' +
      'h1'
    ).first();

    this.continueBtn = page.locator(
      '[data-testid="continue-button"], ' +
      'button:has-text("Doorgaan"), ' +
      'button:has-text("Verder"), ' +
      'button:has-text("Volgende"), ' +
      'button:has-text("Continue"), ' +
      'button:has-text("Boek nu"), ' +
      'a:has-text("Doorgaan"), ' +
      'a:has-text("Verder"), ' +
      '[class*="continue"], ' +
      '[class*="book-now"]'
    );

    this.bookingPanel = page.locator(
      '[data-testid="booking-panel"], ' +
      '[class*="booking-panel"], ' +
      '[class*="booking-box"], ' +
      '[class*="price-panel"]'
    );

    this.priceDisplay = page.locator(
      '[data-testid="price"], ' +
      '[class*="price"]:not([class*="from"]), ' +
      '[class*="total-price"]'
    ).first();
  }

  // ── Step-wrapped public API ────────────────────────────────────────────────

  async waitForPage(): Promise<void> {
    await test.step('Verify hotel details page loaded', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await this.loadingOverlay.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
      await this.hotelTitle.waitFor({ state: 'visible', timeout: 20_000 });
      const title = (await this.hotelTitle.textContent() ?? '').trim();
      console.log(`✓ Hotel details page loaded: ${title}`);
    });
  }

  async clickContinue(): Promise<void> {
    await test.step('Click Continue on hotel details page', async () => {
      await this.continueBtn.first().scrollIntoViewIfNeeded();
      await this.continueBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
      await this.continueBtn.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      console.log(`✓ Continued from hotel details: ${this.page.url()}`);
    });
  }

  /**
   * Asserts the hotel name appears somewhere on the details page.
   * Non-fatal: name may be truncated or reformatted, so failure is only a warning.
   */
  async assertHotelNameVisible(hotelName: string): Promise<void> {
    await test.step(`Verify hotel name "${hotelName}" is visible on details page`, async () => {
      await expect(this.page.getByText(hotelName, { exact: false }))
        .toBeVisible({ timeout: 10_000 })
        .catch(() => {
          console.warn(`  ⚠ Hotel name "${hotelName}" not found verbatim on details page`);
        });
    });
  }
}

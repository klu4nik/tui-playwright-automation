import { Page, Locator, test } from '@playwright/test';

/**
 * HotelListPage – the search results page where hotel cards are listed.
 * After clicking a hotel card, the user lands on the hotel details page.
 * This page also serves as the hotel details step in the booking funnel,
 * where the Continue button initiates the booking flow.
 */
export class HotelListPage {
  readonly page: Page;
  readonly loadingOverlay: Locator;
  readonly continueToHotelBookingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingOverlay = page.locator(
      '[class*="loading"], [class*="spinner"], [aria-busy="true"]'
    );

    this.continueToHotelBookingButton = page.locator(
      '.ResultListItemV2__showPackage button[data-test-id="continue-button"]'
    );
  }

  // ── Step-wrapped public API ────────────────────────────────────────────────

  async waitForPage(): Promise<void> {
    await test.step('Verify hotel list / details page loaded', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await this.loadingOverlay.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
      await this.continueToHotelBookingButton.first().waitFor({ state: 'visible', timeout: 20_000 });
      console.log(`✓ Hotel page loaded: ${this.page.url()}`);
    });
  }

  async clickFirstContinueButton(): Promise<void> {
    await test.step('Click Continue on hotel page', async () => {
      await this.continueToHotelBookingButton.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      console.log(`✓ Continued from hotel page: ${this.page.url()}`);
    });
  }
}

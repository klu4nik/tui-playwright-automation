import { pickRandom } from '@helpers/random';
import { Page, Locator, expect, test } from '@playwright/test';

/**
 * HotelDetailsPage – the individual hotel page reached after clicking a result card.
 */
export class HotelDetailsPage {
  readonly page: Page;

  readonly availableDates: Locator;
  readonly bookingButton: Locator;
  readonly loadingOverlay: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingOverlay = page.locator(
      '[class*="loading"], [class*="spinner"], [aria-busy="true"]'
    );

    // Available dates are gridcells that contain a price element (unavailable ones don't)
    this.availableDates = page.locator('[role="gridcell"]:has([class*="price"])');
    this.bookingButton = page.locator('.ProgressbarNavigation__summaryButton button');
  }

  // ── Step-wrapped public API ────────────────────────────────────────────────

  async waitForPage(): Promise<void> {
    await test.step('Verify hotel details page loaded', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL(/bookaccommodation/i, { timeout: 20_000 });
      console.log(`✓ Hotel details page loaded: ${this.page.url()}`);
    });
  }

  async clickRandomAvailableDate(): Promise<void> {
    await test.step('Select a random available date', async () => {
      await expect(this.availableDates.first()).toBeVisible();
      const dates = await this.availableDates.all();
      expect(dates.length, 'No available dates found in the calendar').toBeGreaterThan(0);
      await pickRandom(dates).click();
      await this.page.waitForLoadState('domcontentloaded');
      console.log(`✓ Date selected on hotel details: ${this.page.url()}`);
    });
  }

  async clickBookButton(): Promise<void> {
    await test.step('Click book button', async () => {
      await this.bookingButton.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      console.log(`✓ Book button clicked: ${this.page.url()}`);
    });
  }
}

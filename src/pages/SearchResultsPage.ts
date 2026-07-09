import { Page, Locator, expect, test } from '@playwright/test';

/**
 * SearchResultsPage – the hotel listing page returned after submitting a search.
 */
export class SearchResultsPage {
  readonly page: Page;

  readonly resultsList: Locator;
  readonly hotelCards: Locator;
  readonly firstHotelCard: Locator;
  readonly loadingSpinner: Locator;
  readonly noResultsMessage: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingSpinner = page.locator(
      '[data-testid="loading"], ' +
      '[class*="spinner"], ' +
      '[class*="loading"], ' +
      '[aria-label*="laden" i], ' +
      '[aria-label*="loading" i]'
    );

    this.resultsList = page.locator(
      '[data-testid="results-list"], ' +
      '[class*="results-list"], ' +
      '[class*="hotel-list"], ' +
      '[class*="search-results"], ' +
      'ul[class*="results"]'
    );

    this.hotelCards = page.locator(
      '.ResultListItemV2, ' +
      '[class*="ResultListItem"], ' +
      '[data-testid="hotel-card"], ' +
      '[class*="hotel-card"], ' +
      'article[class*="hotel"]'
    );

    this.firstHotelCard = this.hotelCards.first();

    this.noResultsMessage = page.locator(
      '[data-testid="no-results"], ' +
      '[class*="no-results"], ' +
      'p:has-text("geen resultaten" i), ' +
      'p:has-text("no results" i)'
    );

    this.sortDropdown = page.locator(
      '[data-testid="sort"], ' +
      'select[name*="sort"], ' +
      '[aria-label*="sorter" i]'
    );
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  private async _waitForResults(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 60_000 }).catch(() => {});
    await this.hotelCards.first().waitFor({ state: 'visible', timeout: 45_000 });
    console.log('✓ Search results loaded');
  }

  private async _getFirstHotelName(): Promise<string> {
    const nameLocator = this.firstHotelCard.locator(
      '[data-testid="hotel-name"], ' +
      '[class*="hotel-name"], ' +
      '[class*="title"], ' +
      'h2, h3'
    ).first();
    return (await nameLocator.textContent() ?? '').trim();
  }

  // ── Step-wrapped public API ────────────────────────────────────────────────

  async waitForResults(): Promise<void> {
    await test.step('Wait for search results to load', async () => {
      await this._waitForResults();
    });
  }

  async getFirstHotelName(): Promise<string> {
    return this._getFirstHotelName();
  }

  async clickFirstHotel(): Promise<string> {
    return test.step('Click the first hotel in search results', async () => {
      await this._waitForResults();

      const hotelName = await this._getFirstHotelName();
      expect(hotelName.length, 'First hotel name must not be empty').toBeGreaterThan(0);
      console.log(`  → First hotel: "${hotelName}"`);

      const ctaLocator = this.firstHotelCard.locator(
        'a, ' +
        'button:has-text("Bekijk"), ' +
        'button:has-text("Meer info"), ' +
        'button:has-text("Details"), ' +
        '[data-testid="hotel-link"]'
      ).first();

      try {
        await ctaLocator.click({ timeout: 5_000 });
      } catch {
        await this.firstHotelCard.click();
      }

      await this.page.waitForLoadState('domcontentloaded');
      console.log(`✓ Navigated to hotel page: ${this.page.url()}`);
      return hotelName;
    });
  }
}

import { Page, Locator, expect, test } from '@playwright/test';

/**
 * FlightSelectionPage – step where the user picks outbound (and optionally
 * return) flights from the available options.
 */
export class FlightSelectionPage {
  readonly page: Page;

  readonly pageHeading: Locator;
  readonly flightOptions: Locator;
  readonly firstFlightOption: Locator;
  readonly continueBtn: Locator;
  readonly loadingOverlay: Locator;
  readonly noFlightsMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingOverlay = page.locator(
      '[class*="loading"], [class*="spinner"], [aria-busy="true"]'
    );

    this.pageHeading = page.locator(
      '[data-testid="flight-selection-heading"], ' +
      'h1:has-text("vlucht" i), ' +
      'h1:has-text("flight" i), ' +
      'h2:has-text("vlucht" i), ' +
      'h1, h2'
    ).first();

    this.flightOptions = page.locator(
      '[data-testid="flight-option"], ' +
      '[class*="flight-option"], ' +
      '[class*="flight-card"], ' +
      '[class*="flight-item"], ' +
      'li[class*="flight"]'
    );

    this.firstFlightOption = this.flightOptions.first();

    this.continueBtn = page.locator(
      '[data-testid="flight-continue"], ' +
      'button:has-text("Doorgaan"), ' +
      'button:has-text("Verder"), ' +
      'button:has-text("Volgende"), ' +
      'button:has-text("Continue"), ' +
      '[class*="continue"]'
    );

    this.noFlightsMessage = page.locator(
      '[data-testid="no-flights"], ' +
      'p:has-text("geen vluchten" i), ' +
      'p:has-text("no flights" i)'
    );
  }

  // ── Step-wrapped public API ────────────────────────────────────────────────

  async waitForPage(): Promise<void> {
    await test.step('Wait for flight selection page to load', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await this.loadingOverlay.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
      await Promise.race([
        this.flightOptions.first().waitFor({ state: 'visible', timeout: 30_000 }),
        this.pageHeading.waitFor({ state: 'visible', timeout: 30_000 }),
      ]);
      console.log('✓ Flight selection page loaded');
    });
  }

  async selectFirstAvailableFlight(): Promise<void> {
    await test.step('Select the first available flight', async () => {
      const flights = await this.flightOptions.all();
      expect(flights.length, 'No flight options found on the page').toBeGreaterThan(0);

      const firstCard  = flights[0];
      const radioOrBtn = firstCard.locator(
        'input[type="radio"], input[type="checkbox"], button, [role="radio"]'
      ).first();

      try {
        await radioOrBtn.click({ timeout: 5_000 });
      } catch {
        await firstCard.click();
      }

      console.log('✓ First flight option selected');
    });
  }

  async clickContinue(): Promise<void> {
    await test.step('Continue from flight selection', async () => {
      await this.continueBtn.first().scrollIntoViewIfNeeded();
      await this.continueBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
      await this.continueBtn.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      console.log(`✓ Continued from flight selection: ${this.page.url()}`);
    });
  }
}

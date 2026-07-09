import { Page, Locator, expect, test } from '@playwright/test';
import { pickRandom } from '@helpers/random';

/**
 * FlightSelectionPage – step where the user picks outbound (and optionally
 * return) flights from the available options.
 */
export class FlightSelectionPage {
  readonly page: Page;

  readonly openAlternativeFlightsButton: Locator;
  readonly selectAlternativeFlightButton: Locator;
  readonly continueBtn: Locator;
  readonly loadingOverlay: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingOverlay = page.locator(
      '[class*="loading"], [class*="spinner"], [aria-busy="true"]'
    );


    this.openAlternativeFlightsButton = page.locator('');
    this.selectAlternativeFlightButton = page.locator('.AlternativeFlights__selectButtonWrapper button');


    this.continueBtn = page.locator('.ProgressbarNavigation__summaryButton button');
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async _clickFlight(card: Locator): Promise<void> {
    const radioOrBtn = card.locator(
      'input[type="radio"], input[type="checkbox"], button, [role="radio"]'
    ).first();
    try {
      await radioOrBtn.click({ timeout: 5_000 });
    } catch {
      await card.click();
    }
  }

  // ── Step-wrapped public API ────────────────────────────────────────────────

  async waitForPage(): Promise<void> {
    await test.step('Wait for flight selection page to load', async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL(/book\/flow\/summary/i, { timeout: 20_000 });
      await this.loadingOverlay.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
      console.log(`✓ Flight selection page loaded: ${this.page.url()}`);
    });
  }

  /**
   * Opens the alternative flights panel then picks a random alternative flight.
   */
  async openAlternativeFlights(): Promise<void> {
    await test.step('Open alternative flights panel', async () => {
      await expect(this.openAlternativeFlightsButton.first()).toBeVisible();
      await this.openAlternativeFlightsButton.first().click();
      await expect(this.selectAlternativeFlightButton.first()).toBeVisible();
      console.log('✓ Alternative flights panel opened');
    });
  }

  async selectRandomAlternativeFlight(): Promise<void> {
    await test.step('Select a random alternative flight', async () => {
      await this.openAlternativeFlights();
      const buttons = await this.selectAlternativeFlightButton.all();
      const picked = pickRandom(buttons);
      await picked.click();
      console.log('✓ Alternative flight selected');
    });
  }


  async clickContinue(): Promise<void> {
    await test.step('Continue from flight selection', async () => {
      await this.continueBtn.first().scrollIntoViewIfNeeded();
      await expect(this.continueBtn.first()).toBeVisible();
      await this.continueBtn.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL(/book\/flow\/summary/i, { timeout: 20_000 });
      console.log(`✓ Navigated to summary: ${this.page.url()}`);
    });
  }
}

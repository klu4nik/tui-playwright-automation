import { Page, expect, test } from '@playwright/test';
import { CookieBanner } from '../components/CookieBanner';
import { SearchPanel } from '../components/SearchPanel';

/**
 * HomePage – https://www.tui.nl/h/nl
 *
 * Composes two focused components:
 *   • cookieBanner – consent overlay
 *   • searchPanel  – holiday search widget
 *
 * Delegation methods keep the public API identical to what the spec files
 * already call (e.g. homePage.acceptCookies(), homePage.clickSearch()) so
 * no test code needs to change.
 */
export class HomePage {
  readonly cookieBanner: CookieBanner;
  readonly searchPanel: SearchPanel;

  constructor(private readonly page: Page) {
    this.cookieBanner = new CookieBanner(page);
    this.searchPanel = new SearchPanel(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await test.step('Open the TUI.nl homepage', async () => {
      await this.page.goto('/h/nl');
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL(/tui\.nl/);
      await expect(this.page).toHaveTitle(/.+/);
      console.log(`✓ Homepage loaded: ${this.page.url()}`);
    });
  }

  // ── Cookie banner (delegated) ──────────────────────────────────────────────

  async acceptCookies(): Promise<void> {
    await this.cookieBanner.accept();
  }

  // ── Search panel (delegated) ───────────────────────────────────────────────

  async selectRandomDepartureAirport(): Promise<string> {
    return this.searchPanel.selectRandomDepartureAirport();
  }

  async selectRandomDestination(): Promise<string> {
    return this.searchPanel.selectRandomDestination();
  }

  async selectDepartureDate(): Promise<string> {
    return this.searchPanel.selectRandomDepartureDate();
  }

  async configureRoomsAndGuests(
    targetRooms: 'default' | number = 'default',
    targetAdults: number = 2,
    targetChild: number = 0,
    childrenAges: number[] = [],
  ): Promise<{ rooms: number | 'default'; adults: number; childAges: string[] }> {
    return this.searchPanel.configureRoomsAndGuests(targetRooms, targetAdults, targetChild, childrenAges);
  }

  async clickSearch(): Promise<void> {
    await this.searchPanel.submit();
  }
}

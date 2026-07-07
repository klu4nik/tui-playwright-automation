import { Page, Locator, expect, test } from '@playwright/test';

/**
 * SearchPanel – the holiday search widget on the TUI.nl homepage.
 *
 * Covers:
 *  - Departure airport picker
 *  - Destination picker
 *  - Date picker
 *  - Rooms & Guests panel
 *  - Search submit button
 */
export class SearchPanel {
  // ── Search widget fields ───────────────────────────────────────────────────
  readonly departureAirportField: Locator;
  readonly destinationField: Locator;
  readonly destinationAirportSelectionButton: Locator;
  readonly departureDateField: Locator;
  readonly roomsGuestsField: Locator;
  readonly searchBtn: Locator;

  // ── Departure airport dropdown ─────────────────────────────────────────────
  readonly departureAirportOptions: Locator;

  // ── Destination country dropdown ───────────────────────────────────────────────────
  readonly destinationCountryOptions: Locator;
  readonly destinationCountrySelectableOptions: Locator;

  // ── Destination airport dropdown ───────────────────────────────────────────────────
  readonly destinationAirportOptions: Locator;
  readonly destinationActiveAirportOptions: Locator;

  // ── Date picker ────────────────────────────────────────────────────────────
  readonly availableDateCells: Locator;
  readonly monthSelectorButton: Locator;

  // ── Rooms & Guests panel ───────────────────────────────────────────────────
  readonly roomsGuestsPanel: Locator;
  readonly adultsIncreaseBtn: Locator;
  readonly adultsDecreaseBtn: Locator;
  readonly adultsCount: Locator;
  readonly addChildBtn: Locator;
  readonly childAgeSelect: Locator;
  readonly roomsGuestsApplyBtn: Locator;

  constructor(private readonly page: Page) {
    // ── Fields ───────────────────────────────────────────────────────────────
    this.departureAirportField = page.locator('[data-test-id="airport-input"]');

    this.destinationField = page.locator('[data-test-id="destination-input"]');
    this.destinationAirportSelectionButton = page.locator(
      '//input[@data-test-id="destination-input"]/..//span/span/span'
    );

    this.departureDateField = page.locator(
      '[data-test-id="departure-date-input"]'
    );

    this.roomsGuestsField = page.locator(
      '[data-testid="rooms-guests"], ' +
      '[aria-label*="kamers" i], ' +
      '[aria-label*="guests" i], ' +
      '[aria-label*="personen" i], ' +
      '.rooms-guests, ' +
      '[data-cy="rooms-guests"]'
    );

    this.searchBtn = page.locator(
      '[data-testid="search-button"], ' +
      'button[type="submit"]:has-text("Zoek"), ' +
      'button:has-text("Zoeken"), ' +
      'button:has-text("Search"), ' +
      '[aria-label*="zoek" i], ' +
      '.search-btn, ' +
      '[data-cy="search-button"]'
    );

    this.departureAirportOptions = page.locator(
      'div[class="SelectAirports__groupcontainer"] .inputs__checkIcon'
    );

    // ── Departure airport dropdown ───────────────────────────────────────────
    this.departureAirportOptions = page.locator(
      'div.SelectAirports__groupcontainer .inputs__checkIcon'
    );

    // ── Destination dropdown ─────────────────────────────────────────────────
    this.destinationCountryOptions = page.locator('ul.DestinationsList__destinationListStyle > li'
    );
    this.destinationCountrySelectableOptions = page.locator('ul.DestinationsList__destinationListStyle > li > a:not(.DestinationsList__disabled)');

    this.destinationAirportOptions = page.locator('div.DestinationsList__droplistContainer .inputs__checkIcon');
    this.destinationActiveAirportOptions = page.locator('div.DestinationsList__droplistContainer label:has(input[type=checkbox]:not([disabled]))');

    // ── Date picker ──────────────────────────────────────────────────────────
    this.availableDateCells = page.locator(
      'td.SelectLegacyDate__available'
    );

    this.monthSelectorButton = page.locator(
      'a.SelectLegacyDate__monthNavigator'
    );

    // ── Rooms & Guests panel ─────────────────────────────────────────────────
    this.roomsGuestsPanel = page.locator(
      '[data-testid="rooms-guests-panel"], ' +
      '.rooms-guests-panel, ' +
      '[aria-label*="kamers" i], ' +
      '[class*="occupancy" i], ' +
      '[class*="passengers" i]'
    );

    this.adultsIncreaseBtn = page.locator(
      '[data-testid="adults-increase"], ' +
      '[aria-label*="volwassenen" i] button[aria-label*="meer" i], ' +
      '[aria-label*="volwassenen" i] button[aria-label*="add" i], ' +
      'button[aria-label*="increase adults" i], ' +
      '[class*="adult"] [class*="increase"], ' +
      '[class*="adult"] button:last-child'
    );

    this.adultsDecreaseBtn = page.locator(
      '[data-testid="adults-decrease"], ' +
      '[aria-label*="volwassenen" i] button[aria-label*="minder" i], ' +
      'button[aria-label*="decrease adults" i], ' +
      '[class*="adult"] [class*="decrease"], ' +
      '[class*="adult"] button:first-child'
    );

    this.adultsCount = page.locator(
      '[data-testid="adults-count"], ' +
      '[aria-label*="volwassenen" i] [class*="count"], ' +
      '[class*="adult"] [class*="value"], ' +
      '[class*="adult"] span[class*="number"]'
    );

    this.addChildBtn = page.locator(
      '[data-testid="add-child"], ' +
      'button:has-text("Kind toevoegen"), ' +
      'button:has-text("Add child"), ' +
      'button[aria-label*="kind" i], ' +
      '[class*="add-child"]'
    );

    this.childAgeSelect = page.locator(
      '[data-testid="child-age"], ' +
      'select[name*="child"], ' +
      '[aria-label*="leeftijd kind" i], ' +
      '[class*="child-age"] select, ' +
      '[class*="child"] select'
    );

    this.roomsGuestsApplyBtn = page.locator(
      '[data-testid="rooms-guests-apply"], ' +
      'button:has-text("Toepassen"), ' +
      'button:has-text("Apply"), ' +
      'button:has-text("Gereed"), ' +
      'button:has-text("Done"), ' +
      '[class*="apply"], ' +
      '[class*="confirm"]'
    );
  }

  // ── Departure airport ──────────────────────────────────────────────────────

  /**
   * Opens the departure airport picker, picks a random option and returns its label.
   */
  async selectRandomDepartureAirport(): Promise<string> {
    return test.step('Select a random departure airport', async () => {
      await this.departureAirportField.first().click();
      await this.page.waitForTimeout(500);

      await this.departureAirportOptions.first().waitFor({ state: 'visible', timeout: 10_000 });

      const options = await this.departureAirportOptions.all();
      expect(options.length, 'No departure airport options found').toBeGreaterThan(0);

      const picked = options[Math.floor(Math.random() * options.length)];
      

      await picked.click();
      const placeholder = (await this.departureAirportField.getAttribute('placeholder') ?? '').trim();
      console.log(`✓ Departure airport placeholder: ${placeholder}`);

      expect(placeholder).not.toBe('');
      return placeholder;
    });
  }


  // ── Destination ────────────────────────────────────────────────────────────

  /**
   * Opens the destination picker and picks a random available entry.
   */
  async selectRandomDestination(): Promise<string> {
    return test.step('Select a random destination', async () => {
      await this.destinationAirportSelectionButton.first().click();
      await this.destinationCountrySelectableOptions.first().waitFor({ state: 'visible', timeout: 10_000 });

      const countryOptions = await this.destinationCountrySelectableOptions.all();
      

      expect(countryOptions.length, 'No destination options found').toBeGreaterThan(0);

      const pickedCountry = countryOptions[Math.floor(Math.random() * countryOptions.length)];
      console.log(`✓ Departure coountries selectors: ${pickedCountry}`);
      await pickedCountry.click();

      await this.destinationActiveAirportOptions.first().waitFor({ state: 'visible', timeout: 10_000 });

      const airportAvailableOptions = await this.destinationActiveAirportOptions.all();
      const pickedAirport =airportAvailableOptions[Math.floor(Math.random() * airportAvailableOptions.length)]
      await pickedAirport.click();


    
      return 'succed';
    });
  }

  // ── Departure date ─────────────────────────────────────────────────────────

  /**
   * Opens the date picker and clicks the first available (non-disabled) date.
   * Advances to the next month if the current one has no selectable dates.
   */
  async selectRandomDepartureDate(): Promise<string> {
    return test.step('Select an random available departure date', async () => {
      await this.departureDateField.first().click();
      await this.page.waitForTimeout(500);

      await this.departureDateField.first().waitFor({ state: 'visible', timeout: 10_000 })
      const availableDates = await this.availableDateCells.all();
      const pickedDate =  availableDates[Math.floor(Math.random() * availableDates.length)];

      await pickedDate.click();


      let dateLabel = '';
      let attempts  = 0;


        const cells = await this.availableDateCells.all();

        for (const cell of cells) {
          if ((await cell.isVisible()) && (await cell.isEnabled())) {
            dateLabel = (await cell.textContent() ?? '').trim();
            await cell.click();
            break;
          }
        }

        if (!dateLabel) {
          await this.monthSelectorButton.click();
          await this.page.waitForTimeout(400);
          attempts++;
        }
      

      expect(dateLabel, 'Could not find an available departure date').not.toBe('');
      console.log(`✓ Departure date selected: ${dateLabel}`);
      return dateLabel;
    });
  }

  // ── Rooms & Guests ─────────────────────────────────────────────────────────

  /**
   * Opens the Rooms & Guests panel, sets adults to targetAdults, adds 1 child
   * with a random age from the available <select> options.
   */
  async configureRoomsAndGuests(targetAdults: number = 2): Promise<{ adults: number; childAge: string }> {
    return test.step(`Set Rooms & Guests to ${targetAdults} adults + 1 child (random age)`, async () => {
      await this.roomsGuestsField.first().click();
      await this.page.waitForTimeout(500);

      await this.adultsIncreaseBtn.first()
        .waitFor({ state: 'visible', timeout: 10_000 })
        .catch(async () => {
          await this.roomsGuestsPanel.first().waitFor({ state: 'visible', timeout: 5_000 });
        });

      // Read current adult count
      let currentAdults = 2;
      try {
        const text = await this.adultsCount.first().textContent();
        currentAdults = parseInt(text?.trim() ?? '2', 10);
      } catch { /* keep default */ }

      while (currentAdults < targetAdults) {
        await this.adultsIncreaseBtn.first().click();
        currentAdults++;
        await this.page.waitForTimeout(200);
      }
      while (currentAdults > targetAdults) {
        await this.adultsDecreaseBtn.first().click();
        currentAdults--;
        await this.page.waitForTimeout(200);
      }

      // Add 1 child
      await this.addChildBtn.first().click();
      await this.page.waitForTimeout(400);

      const select = this.childAgeSelect.first();
      await select.waitFor({ state: 'visible', timeout: 8_000 });

      const validAges: string[] = [];
      for (const opt of await select.locator('option').all()) {
        const val      = await opt.getAttribute('value');
        const disabled = await opt.getAttribute('disabled');
        if (val && val !== '' && val !== '-1' && disabled === null) {
          validAges.push(val);
        }
      }

      expect(validAges.length, 'No valid child age options found').toBeGreaterThan(0);
      const chosenAge = validAges[Math.floor(Math.random() * validAges.length)];
      await select.selectOption(chosenAge);

      console.log(`✓ Rooms & Guests: ${targetAdults} adults, 1 child age ${chosenAge}`);

      try {
        await this.roomsGuestsApplyBtn.first().click({ timeout: 5_000 });
      } catch {
        await this.page.keyboard.press('Escape');
      }

      await this.page.waitForTimeout(300);
      return { adults: targetAdults, childAge: chosenAge };
    });
  }

  // ── Search submit ──────────────────────────────────────────────────────────

  async submit(): Promise<void> {
    await test.step('Submit the holiday search', async () => {
      await this.searchBtn.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).not.toHaveURL(/\/h\/nl$/, { timeout: 20_000 });
      console.log(`✓ Search submitted → ${this.page.url()}`);
    });
  }
}

import { Page, Locator, expect, test } from '@playwright/test';
import { pickRandom } from '../helpers/random';

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
  readonly datesSaveBtn: Locator;

  // ── Rooms & Guests panel ───────────────────────────────────────────────────
  readonly roomsGuestsPanel: Locator;
  readonly roomsSelect: Locator;
  readonly adultsSelect: Locator;
  readonly childrenSelect: Locator;
  readonly childAgeSelect: Locator;
  readonly roomsGuestsApplyBtn: Locator;

  constructor(private readonly page: Page) {
    // ── Fields ───────────────────────────────────────────────────────────────
    this.departureAirportField = page.locator('[data-test-id="airport-input"]');
    this.destinationField = page.locator('[data-test-id="destination-input"]');
    this.destinationAirportSelectionButton = page.locator('//input[@data-test-id="destination-input"]/..//span/span/span');
    this.departureDateField = page.locator('[data-test-id="departure-date-input"]');
    this.roomsGuestsField = page.locator('[data-test-id="rooms-and-guest-input"]');
    this.searchBtn = page.locator('[data-test-id="search-button"]');
    // ── Departure airport dropdown ───────────────────────────────────────────
    this.departureAirportOptions = page.locator('div.SelectAirports__groupcontainer .inputs__checkIcon');

    // ── Destination dropdown ─────────────────────────────────────────────────
    this.destinationCountryOptions = page.locator('ul.DestinationsList__destinationListStyle > li'
    );
    this.destinationCountrySelectableOptions = page.locator('ul.DestinationsList__destinationListStyle > li > a:not(.DestinationsList__disabled)');
    this.destinationAirportOptions = page.locator('div.DestinationsList__droplistContainer .inputs__checkIcon');
    this.destinationActiveAirportOptions = page.locator('div.DestinationsList__droplistContainer label:has(input[type=checkbox]:not([disabled]))');

    // ── Date picker ──────────────────────────────────────────────────────────
    this.availableDateCells = page.locator('td.SelectLegacyDate__available');
    this.monthSelectorButton = page.locator('a.SelectLegacyDate__monthNavigator');
    this.datesSaveBtn = page.locator('span[aria-label="Opslaan Departure date"] button');

    // ── Rooms & Guests panel ─────────────────────────────────────────────────
    this.roomsGuestsPanel = page.locator('[data-test-id="rooms-and-guest-input"]');
    this.roomsSelect = page.locator('div.RoomSelector__roomOptionsSelector select');
    this.adultsSelect = page.locator('div.AdultSelector__adultSelector select');
    this.childrenSelect = page.locator('div.ChildrenSelector__childrenSelector select');
    this.childAgeSelect = page.locator('li.ChildrenAge__childAgeSelector select');
    this.roomsGuestsApplyBtn = page.locator('span[aria-label="Opslaan room and guest"] button');
  }

  // ── Departure airport ──────────────────────────────────────────────────────

  /**
   * Opens the departure airport picker, picks a random option and returns its label.
   */
  async selectRandomDepartureAirport(): Promise<string> {
    return test.step('Select a random departure airport', async () => {
      await this.departureAirportField.first().click();
      await expect(this.departureAirportOptions.first()).toBeVisible();
      const options = await this.departureAirportOptions.all();
      expect(options.length, 'No departure airport options found').toBeGreaterThan(0);

      const picked = pickRandom(options);
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
      await expect(this.destinationCountrySelectableOptions.first()).toBeVisible();
      const countryOptions = await this.destinationCountrySelectableOptions.all();
      console.log(`✓ Departure coountries placeholder: ${countryOptions}`);
      expect(countryOptions.length, 'No destination options found').toBeGreaterThan(0);
      const pickedCountry = pickRandom(countryOptions);
      await pickedCountry.click();
      let placeholder = (await this.destinationField.getAttribute('placeholder') ?? '').trim();
      expect(placeholder, "Can't find available country").not.toBe('');
      await expect(this.destinationAirportOptions.first()).toBeVisible();
      const airportAvailableOptions = await this.destinationActiveAirportOptions.all();
      const pickedAirport = pickRandom(airportAvailableOptions);
      await pickedAirport.click();
      placeholder = (await this.destinationField.getAttribute('placeholder') ?? '').trim();
      expect(placeholder, "Can't find available airports").not.toBe('');
      return placeholder;
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
      await expect(this.availableDateCells.first()).toBeVisible();
      const availableDates = await this.availableDateCells.all();
      const pickedDate = pickRandom(availableDates);
      await pickedDate.click();
      await this.datesSaveBtn.click();
      const dateLabel = (await this.departureDateField.getAttribute('value') ?? '').trim();
      expect(dateLabel, 'Could not find an available departure date').not.toBe('');
      console.log(`✓ Departure date selected: ${dateLabel}`);
      return dateLabel;
    });
  }

  // ── Rooms & Guests ─────────────────────────────────────────────────────────

  /**
   * Opens the Rooms & Guests panel and configures rooms, adults and children
   * using the four dropdowns (rooms, adults, children count, child age).
   *
   * @param targetRooms   - Number of rooms to select, or 'default' to skip
   * @param targetAdults  - Number of adults to select (default: 2)
   * @param targetChild   - Number of children to select (default: 0)
   * @param childrenAges  - Explicit ages per child; children without a provided
   *                        age get a random valid value from the age dropdown
   */
  async configureRoomsAndGuests(
    targetRooms: 'default' | number = 'default',
    targetAdults: number = 2,
    targetChild: number = 0,
    childrenAges: number[] = [],
  ): Promise<{ rooms: number | 'default'; adults: number; childAges: string[] }> {
    return test.step(
      `Set Rooms & Guests: rooms=${targetRooms}, adults=${targetAdults}, children=${targetChild}`,
      async () => {
        await this.roomsGuestsField.first().click();
        await this.page.waitForTimeout(500);

        // Wait for the panel to be visible
        await expect(this.adultsSelect.first()).toBeVisible()
          .catch(async () => {
            await expect(this.roomsGuestsPanel.first()).toBeVisible();
          });

        // ── Rooms ──────────────────────────────────────────────────────────
        if (targetRooms !== 'default') {
          await this.roomsSelect.first().selectOption({ value: String(targetRooms) });
          await this.page.waitForTimeout(200);
        }

        // ── Adults ─────────────────────────────────────────────────────────
        await this.adultsSelect.first().selectOption(String(targetAdults));
        await this.page.waitForTimeout(200);

        // ── Children count ─────────────────────────────────────────────────
        if (targetChild > 0) {
          await this.childrenSelect.first().selectOption(String(targetChild));
          await this.page.waitForTimeout(400);
        }

        // ── Child ages ─────────────────────────────────────────────────────
        const chosenAges: string[] = [];

        for (let i = 0; i < targetChild; i++) {
          const select = this.childAgeSelect.nth(i);
          await expect(select).toBeVisible();

          const providedAge = childrenAges[i];
          let chosenAge: string;

          if (providedAge !== undefined) {
            chosenAge = String(providedAge);
            await select.selectOption(chosenAge);
          } else {
            const validAges: string[] = [];
            for (const opt of await select.locator('option').all()) {
              const val = await opt.getAttribute('value');
              const disabled = await opt.getAttribute('disabled');
              if (val && val !== '' && val !== '-1' && disabled === null) {
                validAges.push(val);
              }
            }
            expect(validAges.length, `No valid age options for child ${i + 1}`).toBeGreaterThan(0);
            chosenAge = pickRandom(validAges);
            await select.selectOption(chosenAge);
          }

          chosenAges.push(chosenAge);
        }

        console.log(
          `✓ Rooms & Guests: rooms=${targetRooms}, adults=${targetAdults}, ` +
          `children=${targetChild} ages=[${chosenAges.join(', ')}]`
        );
        try {
          await this.roomsGuestsApplyBtn.first().click();
        } catch {
          await this.page.keyboard.press('Escape');
        }
        return { rooms: targetRooms, adults: targetAdults, childAges: chosenAges };
      }
    );
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

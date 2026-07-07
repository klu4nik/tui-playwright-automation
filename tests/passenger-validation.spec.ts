/**
 * passenger-validation.spec.ts
 *
 * Validation checks for the Passenger Details form.
 *
 * Strategy
 * ─────────
 * Part A – "Full funnel + empty submit"
 *   Runs the complete booking funnel once to land on the Passenger Details
 *   page, saves the session, then submits the empty form.
 *
 * Part B – "Field-level validation" (isolated)
 *   Reuses the session URL saved by Part A so each scenario skips the funnel.
 *   Gracefully skipped if Part A has not run yet.
 *
 * All test.step() labels live in the Page Object methods — the spec contains
 * only POM method calls.
 */

import * as path from 'path';
import * as fs from 'fs';
import { test } from '../src/fixtures/pages';

// ── Shared session state ────────────────────────────────────────────────────

const STATE_DIR  = path.join(__dirname, '..', 'test-results', 'session-state');
const STATE_FILE = path.join(STATE_DIR, 'passenger-page.json');

interface SessionState {
  passengerPageUrl: string;
  storageStatePath: string;
}

function loadSessionState(): SessionState | null {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')) as SessionState;
  } catch {
    return null;
  }
}

function saveSessionState(state: SessionState): void {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════
// PART A – Full funnel + empty-form submission
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Part A – Full funnel: Passenger Details form validation', () => {

  test('A1 – Arrive at Passenger Details and submit empty form: required-field errors appear', async ({
    page,
    homePage,
    searchResultsPage,
    hotelDetailsPage,
    flightSelectionPage,
    passengerDetailsPage,
  }) => {

    // Run the full booking funnel
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.selectRandomDepartureAirport();
    await homePage.selectRandomDestination();
    await homePage.selectDepartureDate();
    await homePage.configureRoomsAndGuests(2);
    await homePage.clickSearch();

    const hotelName = await searchResultsPage.clickFirstHotel();

    await hotelDetailsPage.waitForPage();
    await hotelDetailsPage.assertHotelNameVisible(hotelName);
    await hotelDetailsPage.clickContinue();

    await flightSelectionPage.waitForPage();
    await flightSelectionPage.selectFirstAvailableFlight();
    await flightSelectionPage.clickContinue();

    await passengerDetailsPage.waitForPage();

    // Save session for Part B
    const storageStatePath = path.join(STATE_DIR, 'cookies.json');
    fs.mkdirSync(STATE_DIR, { recursive: true });
    await page.context().storageState({ path: storageStatePath });
    saveSessionState({ passengerPageUrl: page.url(), storageStatePath });
    console.log(`✓ Passenger page URL saved: ${page.url()}`);

    // Submit the empty form and verify errors
    await passengerDetailsPage.triggerValidation();
    await passengerDetailsPage.assertErrorsVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PART B – Field-level validation scenarios
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Part B – Field-level validation on Passenger Details', () => {

  test.beforeEach(async ({ page, passengerDetailsPage }) => {
    const state = loadSessionState();
    if (!state) {
      test.skip(true, 'No saved session state – run Part A first to generate it');
      return;
    }
    await page.goto(state.passengerPageUrl);
    await passengerDetailsPage.waitForPage();
  });

  test('B1  – Missing first name shows a required-field error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateMissingFirstName();
    });

  test('B2  – Missing last name shows a required-field error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateMissingLastName();
    });

  test('B3  – Numeric first name shows an invalid-input error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateNumericFirstName();
    });

  test('B4  – Special characters in last name show an invalid-input error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateSpecialCharLastName();
    });

  test('B5  – Email without "@" shows an invalid-email error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateEmailNoAt();
    });

  test('B6  – Email without TLD shows an invalid-email error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateEmailNoTld();
    });

  test('B7  – Email with spaces shows an invalid-email error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateEmailWithSpaces();
    });

  test('B8  – Phone number containing letters shows an invalid-phone error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validatePhoneWithLetters();
    });

  test('B9  – Phone number that is too short shows an invalid-phone error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validatePhoneTooShort();
    });

  test('B10 – Missing date of birth shows a required-field error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateMissingDateOfBirth();
    });

  test('B11 – Past passport expiry date shows an invalid-date error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validatePastPassportExpiry();
    });

  test('B12 – Missing passport number shows a required-field error',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateMissingPassportNumber();
    });

  test('B13 – Submitting all fields blank shows multiple errors',
    async ({ passengerDetailsPage }) => {
      await passengerDetailsPage.validateAllFieldsBlank();
    });
});

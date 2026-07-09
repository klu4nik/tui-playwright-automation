/**
 * booking-journey.spec.ts
 *
 * End-to-end test covering the full TUI.nl holiday booking funnel:
 *   1.  Open homepage
 *   2.  Accept cookies
 *   3.  Select a random departure airport
 *   4.  Select a random destination
 *   5.  Select an available departure date
 *   6.  Configure Rooms & Guests: 2 adults + 1 child (random age)
 *   7.  Submit the search
 *   8.  Pick the first hotel from results
 *   9.  On hotel details, click Continue
 *   10. Select the first available flight
 *   11. Continue → Passenger Details page
 *   12. Fill valid passenger details and continue to the next step
 *
 * The slow search funnel (steps 1–11) runs once per test in `beforeEach`,
 * so every test starts already on the Passenger Details page.
 *
 * All test.step() labels live in the Page Object methods — the spec is a
 * clean, flat sequence of POM calls.
 */

import {test, expect} from '@fixtures/pages';
import {generatePassengerData} from '@helpers/random';
import {HomePage} from '@pages/HomePage';

/**
 * Returns the age (in years) of the first child configured during the search,
 * so the passenger-details form fills a date of birth that matches the age
 * selected in the Rooms & Guests panel. Falls back to 8 when no child was set.
 */
function childAgeFromSearch(homePage: HomePage): number {
    return homePage.lastChildAges[0] ?? 8;
}

// ── Shared funnel (runs before each test) ─────────────────────────────────

test.beforeEach(async ({
                          homePage,
                          hotelListPage,
                          hotelDetailsPage,
                          flightSelectionPage,
                          passengerDetailsPage,
                      }) => {
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.selectRandomDepartureAirport();
    await homePage.selectRandomDestination();
    await homePage.selectDepartureDate();
    await homePage.configureRoomsAndGuests('default', 2, 1);
    await homePage.clickSearch();

    await hotelListPage.waitForPage();
    await hotelListPage.clickFirstContinueButton();

    await hotelDetailsPage.waitForPage();
    await hotelDetailsPage.clickRandomAvailableDate();
    await hotelDetailsPage.clickBookButton();

    await flightSelectionPage.waitForPage();
    await flightSelectionPage.selectRandomAlternativeFlight();
    await flightSelectionPage.clickContinue();

    await passengerDetailsPage.waitForPage();
});

// ── Full journey ───────────────────────────────────────────────────────────

test.describe('TUI.nl Holiday Booking Journey', () => {

    test('Complete booking funnel from homepage to passenger details', async ({
                                                                                   homePage,
                                                                                   passengerDetailsPage,
                                                                               }) => {

        // Step 12 – Fill valid passenger details (2 adults + 1 child) and continue
        const adult1 = generatePassengerData();
        const adult2 = generatePassengerData();
        const child = generatePassengerData({isChild: true, childAge: childAgeFromSearch(homePage)});
        await passengerDetailsPage.fillAllTravellers(adult1, adult2, child);
        await passengerDetailsPage.clickContinue();

        // No validation errors should block the happy path
        await expect(passengerDetailsPage.mainErrorMessage).toBeHidden();

        console.log('\n📋 Journey summary:');
        console.log(`   Passenger:   ${adult1.firstName} ${adult1.lastName} (+ ${adult2.firstName} ${adult2.lastName}, ${child.firstName} ${child.lastName})`);
    });
});

// ── Passenger Details – Positive scenarios ────────────────────────────────

test.describe('Passenger Details – Positive scenarios', () => {

    test('Valid passenger details produce no validation errors', async ({homePage, passengerDetailsPage}) => {
        const adult1 = generatePassengerData();
        const adult2 = generatePassengerData();
        const child = generatePassengerData({isChild: true, childAge: childAgeFromSearch(homePage)});
        await passengerDetailsPage.fillAllTravellers(adult1, adult2, child);

        // Trigger validation with a fully valid form
        await passengerDetailsPage.triggerValidation();

        const errors = await passengerDetailsPage.getVisibleErrorTexts();
        expect(errors.length, `Expected no validation errors for valid data, but found: ${JSON.stringify(errors)}`).toBe(0);
        console.log('✓ Valid passenger details (2 adults + 1 child) submitted without validation errors');
    });

    test('Valid passenger details allow continuing to the next step', async ({homePage, passengerDetailsPage}) => {
        const adult1 = generatePassengerData();
        const adult2 = generatePassengerData();
        const child = generatePassengerData({isChild: true, childAge: childAgeFromSearch(homePage)});
        await passengerDetailsPage.fillAllTravellers(adult1, adult2, child);
        await passengerDetailsPage.clickContinue();

        // The main error banner must not be visible on the happy path
        await expect(passengerDetailsPage.mainErrorMessage, 'Main error banner should stay hidden for valid data').toBeHidden();
        console.log('✓ Valid passenger details (2 adults + 1 child) accepted and form continued');
    });
});

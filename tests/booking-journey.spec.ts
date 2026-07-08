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
 *   11. Continue → Passenger Details page (verified as the final assertion)
 *
 * All test.step() labels live in the Page Object methods — the spec is a
 * clean, flat sequence of POM calls.
 */

import { test } from '../src/fixtures/pages';

test.describe('TUI.nl Holiday Booking Journey', () => {

  test('Complete booking funnel from homepage to passenger details', async ({
    homePage,
    searchResultsPage,
    hotelDetailsPage,
    flightSelectionPage,
    passengerDetailsPage,
  }) => {

    // Step 1 – Open homepage
    await homePage.goto();

    // Step 2 – Accept cookies
    await homePage.acceptCookies();

    // Step 3 – Select a random departure airport
    const departureAirport = await homePage.selectRandomDepartureAirport();

    // Step 4 – Select a random destination
    const destination = await homePage.selectRandomDestination();

    // Step 5 – Select an available departure date
    const departureDate = await homePage.selectDepartureDate();

    // Step 6 – Set Rooms & Guests: 2 adults + 1 child (random age)
    const { childAges } = await homePage.configureRoomsAndGuests('default', 2, 1);

    // Step 7 – Submit the search
    await homePage.clickSearch();

    // Step 8 – Click the first hotel in results
    const hotelName = await searchResultsPage.clickFirstHotel();

    // Step 9 – Verify hotel details page and continue
    await hotelDetailsPage.waitForPage();
    await hotelDetailsPage.assertHotelNameVisible(hotelName);
    await hotelDetailsPage.clickContinue();

    // Step 10 – Select the first available flight and continue
    await flightSelectionPage.waitForPage();
    await flightSelectionPage.selectFirstAvailableFlight();
    await flightSelectionPage.clickContinue();

    // Step 11 – Verify arrival on the Passenger Details page
    await passengerDetailsPage.waitForPage();

    console.log('\n📋 Journey summary:');
    console.log(`   Departure:   ${departureAirport}`);
    console.log(`   Destination: ${destination}`);
    console.log(`   Date:        ${departureDate}`);
    console.log(`   Guests:      2 adults + 1 child (age ${childAges[0]})`);
    console.log(`   Hotel:       ${hotelName}`);
  });
});

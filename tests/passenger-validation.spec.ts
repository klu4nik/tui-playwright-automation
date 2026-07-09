/**
 * passenger-validation.spec.ts
 *
 * Part A – Full funnel to reach the Passenger Details page, then submit empty
 *          form to verify required-field errors appear.
 *
 * Part B – Field-level validation: each test runs the full funnel to reach
 *          Passenger Details, pre-fills valid data, then tests one bad value.
 */

import { test } from '@fixtures/pages';
import { generatePassengerData } from '@helpers/random';
import { HomePage } from '@pages/HomePage';
import { HotelListPage } from '@pages/HotelListPage';
import { HotelDetailsPage } from '@pages/HotelDetailsPage';
import { FlightSelectionPage } from '@pages/FlightSelectionPage';
import { PassengerDetailsPage } from '@pages/PassengerDetailsPage';

// ── Shared funnel helper ───────────────────────────────────────────────────

async function navigateToPassengerDetails(fixtures: {
    homePage: HomePage;
    hotelListPage: HotelListPage;
    hotelDetailsPage: HotelDetailsPage;
    flightSelectionPage: FlightSelectionPage;
    passengerDetailsPage: PassengerDetailsPage;
}): Promise<void> {
    const { homePage, hotelListPage, hotelDetailsPage, flightSelectionPage, passengerDetailsPage } = fixtures;

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.selectDepartureAirport('Amsterdam');
    await homePage.selectDestination('Egypte', 'Hurghada');
    await homePage.selectDepartureDate();
    await homePage.configureRoomsAndGuests('default', 1, 0);
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
}

// ── Part A ─────────────────────────────────────────────────────────────────

test.describe('Part A – Full funnel: Passenger Details form validation', () => {
    test.beforeEach(
        async ({ homePage, hotelListPage, hotelDetailsPage, flightSelectionPage, passengerDetailsPage }) => {
            await navigateToPassengerDetails({
                homePage,
                hotelListPage,
                hotelDetailsPage,
                flightSelectionPage,
                passengerDetailsPage,
            });
        },
    );

    test('A1 – Arrive at Passenger Details and submit empty form: required-field errors appear', async ({
        passengerDetailsPage,
    }) => {
        await passengerDetailsPage.triggerValidation();
        await passengerDetailsPage.assertErrorsVisible();
        await passengerDetailsPage.assertMainErrorMessageErrorCount();
    });
});

// ── Part B ─────────────────────────────────────────────────────────────────

test.describe('Part B – Field-level validation on Passenger Details', () => {
    test.beforeEach(
        async ({ homePage, hotelListPage, hotelDetailsPage, flightSelectionPage, passengerDetailsPage }) => {
            await navigateToPassengerDetails({
                homePage,
                hotelListPage,
                hotelDetailsPage,
                flightSelectionPage,
                passengerDetailsPage,
            });
        },
    );

    test('B1  – Missing first name shows a required-field error', async ({ passengerDetailsPage }) => {
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateMissingFirstName();
    });

    test('B2  – Missing last name shows a required-field error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateMissingLastName();
    });

    test('B3  – Numeric first name shows an invalid-input error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateNumericFirstName();
    });

    test('B4  – Special characters in last name show an invalid-input error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateSpecialCharLastName();
    });

    test('B5  – Email without "@" shows an invalid-email error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateEmailNoAt();
    });

    test('B6  – Email without TLD shows an invalid-email error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateEmailNoTld();
    });

    test('B7  – Email with spaces shows an invalid-email error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateEmailWithSpaces();
    });

    test('B8  – Phone number containing letters shows an invalid-phone error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validatePhoneWithLetters();
    });

    test('B9  – Phone number that is too short shows an invalid-phone error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validatePhoneTooShort();
    });

    test('B10 – Missing date of birth shows a required-field error', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.fillTravelerDetails(generatePassengerData());
        await passengerDetailsPage.validateMissingDateOfBirth();
    });

    test('B13 – Submitting all fields blank shows multiple errors', async ({
        homePage,
        hotelListPage,
        hotelDetailsPage,
        flightSelectionPage,
        passengerDetailsPage,
    }) => {
        await navigateToPassengerDetails({
            homePage,
            hotelListPage,
            hotelDetailsPage,
            flightSelectionPage,
            passengerDetailsPage,
        });
        await passengerDetailsPage.validateAllFieldsBlank();
    });
});

import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { HotelListPage } from '../pages/HotelListPage';
import { FlightSelectionPage } from '../pages/FlightSelectionPage';
import { PassengerDetailsPage } from '../pages/PassengerDetailsPage';
import { HotelDetailsPage } from '@pages/HotelDetailsPage';

/**
 * Extended Playwright fixture that injects all Page Object instances
 * into each test automatically.
 *
 * Usage in tests:
 *   import { test, expect } from '../src/fixtures/pages';
 */
type PageFixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  hotelListPage: HotelListPage;
  hotelDetailsPage : HotelDetailsPage;
  flightSelectionPage: FlightSelectionPage;
  passengerDetailsPage: PassengerDetailsPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  hotelListPage: async ({ page }, use) => {
    await use(new HotelListPage(page));
  },
  hotelDetailsPage: async ({ page }, use) => {
    await use(new HotelDetailsPage(page));
  },
  flightSelectionPage: async ({ page }, use) => {
    await use(new FlightSelectionPage(page));
  },
  passengerDetailsPage: async ({ page }, use) => {
    await use(new PassengerDetailsPage(page));
  },
});

export { expect } from '@playwright/test';

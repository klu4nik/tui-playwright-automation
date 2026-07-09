# TUI.nl Playwright Automation

Automated end-to-end test suite for the TUI.nl holiday booking funnel using Playwright and TypeScript.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**

## Installation

```bash
npm install
npx playwright install chromium
```

## Project Structure

```
tui-playwright-automation/
├── src/
│   ├── components/       # Reusable UI components (SearchPanel, CookieBanner)
│   ├── pages/            # Page Object Models (HomePage, HotelDetailsPage, etc.)
│   ├── fixtures/         # Playwright fixtures for dependency injection
│   └── helpers/          # Utility functions (random data generators)
├── tests/
│   ├── booking-journey.spec.ts        # Full booking funnel E2E test
│   └── passenger-validation.spec.ts   # Form validation tests
├── playwright.config.ts  # Playwright configuration
└── tsconfig.json         # TypeScript configuration
```

## Running Tests

### Run all tests (headless)
```bash
npm test
```

### Run with browser visible
```bash
npm run test:headed
```

### Run specific test suite
```bash
npm run test:booking        # Booking journey only
npm run test:validation     # Validation tests only
```

### Interactive UI mode
```bash
npm run test:ui
```

### Debug mode (step-through)
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/booking-journey.spec.ts
```

### Run with trace on
```bash
npx playwright test --trace on
```

## Viewing Test Reports

After a test run:

```bash
npm run report
```

Opens the HTML report at `http://localhost:9323`

## Test Coverage

### Booking Journey (`booking-journey.spec.ts`)
Full end-to-end flow:
1. Homepage → Cookie acceptance
2. Search form: departure airport, destination, dates, guests
3. Hotel search results → select hotel
4. Hotel details → date selection → booking
5. Flight selection
6. Passenger details (assertion point)

### Passenger Validation (`passenger-validation.spec.ts`)
Field-level and form-level validation:
- Required field checks
- Invalid input patterns (numeric names, malformed emails, etc.)
- Multi-error display on submit

## Configuration

Key settings in `playwright.config.ts`:
- **Base URL**: `https://www.tui.nl`
- **Locale**: `nl-NL`
- **Viewport**: 1440×900
- **Timeout**: 600s (booking flow can be slow)
- **Workers**: 1 (sequential execution due to state dependencies)

## Page Object Pattern

All selectors and interactions are encapsulated in Page Objects:
- `HomePage` → delegates to `SearchPanel` and `CookieBanner` components
- `SearchResultsPage` → hotel list interactions
- `HotelDetailsPage` → date and room selection
- `FlightSelectionPage` → flight picker
- `PassengerDetailsPage` → form filling and validation

## Troubleshooting

### Tests timing out
Increase `timeout` in `playwright.config.ts` or run with higher timeout:
```bash
npx playwright test --timeout=900000
```

### Selectors not found
Enable trace for debugging:
```bash
npx playwright test --trace on
```
Then view trace:
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

### Flaky date picker
The test uses fuzzy date selection logic that picks random available dates. Check `SearchPanel.ts` → `selectRandomDepartureDate()` if dates are frequently unavailable.

## CI/CD

The suite is CI-ready:
- `CI=true` → runs headless with 1 retry
- Artifacts: screenshots, videos, traces on failure

Example GitHub Actions snippet:
```yaml
- name: Run Playwright tests
  run: npm test
  env:
    CI: true
```

## License

MIT

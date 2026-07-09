import { Page, Locator, expect, test } from '@playwright/test';
import { INVALID_PASSENGER_DATA, PassengerData } from '@helpers/random';

/**
 * PassengerDetailsPage – the form where travellers fill in their personal
 * details.  This page is also used for validation-error checks.
 *
 * All public action methods are wrapped in test.step() so spec files stay
 * as a clean, flat sequence of method calls.
 */
export class PassengerDetailsPage {
    readonly page: Page;

    readonly pageHeading: Locator;

    // ── First passenger (adult 1) form fields ─────────────────────────────────
    readonly firstNameAdultInput: Locator;
    readonly lastNameAdultInput: Locator;
    readonly genderAdultSelect: Locator;
    readonly dateOfBirthDDInput: Locator;
    readonly dateOfBirthMMInput: Locator;
    readonly dateOfBirthYYYYInput: Locator;
    readonly nationalityAdultSelect: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly firstNameKidInput: Locator;
    readonly lastNameKidInput: Locator;
    readonly genderKidSelect: Locator;

    // ── Address / contact fields ──────────────────────────────────────────────
    readonly landAdultDropdown: Locator;
    readonly streetNameInput: Locator;
    readonly houseNumberInput: Locator;
    readonly postalCodeInput: Locator;
    readonly cityAdultInput: Locator;
    readonly mobileNumberIndexDropdown: Locator;
    readonly mobileNumberInput: Locator;

    // ── Stay-at-home emergency contact ("Informatie thuisblijver") ────────────
    readonly stayHomeLastNameInput: Locator;
    readonly stayHomeMobileInput: Locator;

    // ── Form-level submit / continue ──────────────────────────────────────────
    readonly continueBtn: Locator;

    // ── Validation error messages ─────────────────────────────────────────────
    readonly mainErrorMessage: Locator;
    readonly allErrorFieldMessages: Locator;
    readonly firstNameError: Locator;
    readonly lastNameError: Locator;
    readonly dateOfBirthError: Locator;
    readonly emailError: Locator;
    readonly phoneError: Locator;
    readonly genderError: Locator;
    readonly nationalityError: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page
            .locator(
                '[data-testid="passenger-heading"], ' +
                    'h1:has-text("reiziger" i), ' +
                    'h1:has-text("passenger" i), ' +
                    'h1:has-text("gegevens" i), ' +
                    'h1, h2',
            )
            .first();

        this.firstNameAdultInput = page.locator('input[id^="FIRSTNAMEADULT"]');

        this.lastNameAdultInput = page.locator('input[id^="SURNAMEADULT"]');
        this.genderAdultSelect = page.locator('select[id^="GENDERADULT"]');
        this.firstNameKidInput = page.locator('input[id^="FIRSTNAMECHILD"]');
        this.lastNameKidInput = page.locator('input[id^="SURNAMECHILD"]');
        this.genderKidSelect = page.locator('select[id^="GENDERCHILD"]');

        this.dateOfBirthDDInput = page.locator('.DateInput__field input[aria-label="day"]');
        this.dateOfBirthMMInput = page.locator('.DateInput__field input[aria-label="month"]');
        this.dateOfBirthYYYYInput = page.locator('.DateInput__field input[aria-label="year"]');

        this.nationalityAdultSelect = page.locator('select[id^="NATIONALITYADULT"]');

        this.landAdultDropdown = page.locator('select[id^="COUNTRYADULT"]');

        this.streetNameInput = page.locator('input[id^="STREETADULT"]');

        this.houseNumberInput = page.locator('input[id^="HOUSENUMBERADULT"]');

        this.postalCodeInput = page.locator('input[id^="POSTALCODEADULT"]');
        this.cityAdultInput = page.locator('input[id^="CITYADULT"]');

        this.mobileNumberIndexDropdown = page.locator('select[id^="MOBILENUMBERINDEXADULT"]');

        this.mobileNumberInput = page.locator('input[id^="MOBILENUMBERADULT"]');

        this.emailInput = page.locator('input[id^="EMAILADDRESSADULT"]');

        // phoneInput aliases mobileNumberInput for validation helpers
        this.phoneInput = this.mobileNumberInput;

        // ── Stay-at-home emergency contact ("Informatie thuisblijver") ─────────
        this.stayHomeLastNameInput = page.locator('input[name="stayHomelastName"]');
        this.stayHomeMobileInput = page.locator('input[name="stayHomemobileNum"]');

        this.continueBtn = page.locator('.ContinueButtonV2__continueBottom button');

        // ── Error messages ─────────────────────────────────────────────────────
        this.mainErrorMessage = page.locator('.alerts__alertText');
        this.allErrorFieldMessages = page.locator('.inputs__errorMessageWithIcon');

        this.firstNameError = page.locator('[id^="FIRSTNAMEADULT"][id$="__errorMessage"]');

        this.lastNameError = page.locator('[id^="LASTNAMEADULT"][id$="__errorMessage"]');

        this.dateOfBirthError = page.locator('.DateOfBirth__inputTextBox .inputs__errorMessageIcon');

        this.emailError = page.locator('[id^="EMAILADDRESSADULT"][id$="__errorMessage"]');

        this.phoneError = page.locator('[id^="MOBILENUMBERADULT"][id$="__errorMessage"]');

        this.genderError = page.locator('');

        this.nationalityError = page.locator('');
    }

    // ── Page lifecycle ─────────────────────────────────────────────────────────

    async waitForPage(): Promise<void> {
        await test.step('Verify arrival on the Passenger Details page', async () => {
            await this.page.waitForLoadState('domcontentloaded');
            await expect(this.page)
                .toHaveURL(/passengerdetails/i)
                .catch(async () => {
                    console.warn('  ⚠ URL pattern not matched; checking form fields directly');
                    await expect(this.firstNameAdultInput).toBeVisible();
                });

            console.log('✓ Passenger details page confirmed');
        });
    }

    // ── Form helpers ───────────────────────────────────────────────────────────

    async fillField(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.clear();
        await locator.fill(value);
    }

    async clearField(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.clear();
    }

    /**
     * Selects a gender. The form renders gender as a <select> whose options are
     * "MAN" / "VROUW", so we prefer `selectOption`. A radio-input fallback is
     * kept for layouts that use inputs with value M/F (or male/female).
     */
    private async selectGender(selectLocator: Locator, gender: 'male' | 'female'): Promise<void> {
        if (!(await selectLocator.isVisible().catch(() => false))) return;
        const value = gender === 'male' ? 'MAN' : 'VROUW';
        await selectLocator.selectOption(value).catch(async () => {
            const radio = this.page
                .locator('input[value="M"], input[value="F"], input[value="male"], input[value="female"]')
                .first();
            if (await radio.isVisible().catch(() => false)) await radio.click();
        });
    }

    // ── Fill traveler details ─────────────────────────────────────────────────

    /**
     * Fills in all fields for a single traveler (adult 1 / lead passenger).
     * Skips any field that is not visible on the page.
     *
     * @param data - Generated or custom PassengerData object
     */
    async fillTravelerDetails(data: PassengerData): Promise<void> {
        await test.step(`Fill traveler details for ${data.firstName} ${data.lastName}`, async () => {
            // ── Text inputs – fill all in a single loop ───────────────────────
            const textFields: Array<{ label: string; locator: Locator; value: string }> = [
                { label: 'first name', locator: this.firstNameAdultInput.first(), value: data.firstName },
                { label: 'last name', locator: this.lastNameAdultInput.first(), value: data.lastName },
                { label: 'email', locator: this.emailInput.first(), value: data.email },
                { label: 'mobile number', locator: this.mobileNumberInput.first(), value: data.mobileNumber },
                { label: 'street', locator: this.streetNameInput.first(), value: data.streetName },
                { label: 'house number', locator: this.houseNumberInput.first(), value: data.houseNumber },
                { label: 'postal code', locator: this.postalCodeInput.first(), value: data.postalCode },
                { label: 'city', locator: this.cityAdultInput.first(), value: data.city },
            ];

            for (const { label, locator, value } of textFields) {
                await test.step(`Fill ${label}`, async () => {
                    if (await locator.isVisible().catch(() => false)) {
                        await this.fillField(locator, value);
                    }
                });
            }

            // ── Dropdowns ─────────────────────────────────────────────────────
            await test.step('Select gender', async () => {
                await this.selectGender(this.genderAdultSelect.first(), data.gender);
            });

            await test.step('Select nationality', async () => {
                if (
                    await this.nationalityAdultSelect
                        .first()
                        .isVisible()
                        .catch(() => false)
                ) {
                    await this.nationalityAdultSelect
                        .first()
                        .selectOption(data.nationality)
                        .catch(async () => {
                            await this.fillField(this.nationalityAdultSelect.first(), data.nationality);
                        });
                }
            });

            await test.step('Select country', async () => {
                if (
                    await this.landAdultDropdown
                        .first()
                        .isVisible()
                        .catch(() => false)
                ) {
                    await this.landAdultDropdown
                        .first()
                        .selectOption(data.country)
                        .catch(async () => {
                            await this.fillField(this.landAdultDropdown.first(), data.country);
                        });
                }
            });

            await test.step('Select mobile country code', async () => {
                if (
                    await this.mobileNumberIndexDropdown
                        .first()
                        .isVisible()
                        .catch(() => false)
                ) {
                    await this.mobileNumberIndexDropdown
                        .first()
                        .selectOption(data.mobileCountryCode)
                        .catch(async () => {
                            await this.fillField(this.mobileNumberIndexDropdown.first(), data.mobileCountryCode);
                        });
                }
            });

            // ── Date of birth (3 separate inputs) ────────────────────────────
            await test.step('Fill date of birth', async () => {
                const [yyyy, mm, dd] = data.dateOfBirth.split('-');
                const dobFields: Array<{ locator: Locator; value: string }> = [
                    { locator: this.dateOfBirthDDInput, value: dd },
                    { locator: this.dateOfBirthMMInput, value: mm },
                    { locator: this.dateOfBirthYYYYInput, value: yyyy },
                ];
                for (const { locator, value } of dobFields) {
                    if (await locator.isVisible().catch(() => false)) {
                        await this.fillField(locator, value);
                    }
                }
            });

            console.log(`✓ Traveler details filled: ${data.firstName} ${data.lastName}`);
        });
    }

    /**
     * Fills the second adult's details. The form uses the same field-name
     * prefixes as the lead adult (e.g. `FIRSTNAMEADULT`, `SURNAMEADULT`), so the
     * second adult's controls are reached with `.nth(1)` of the existing
     * locators. Any field that is not present on the page is skipped.
     */
    async fillSecondAdult(data: PassengerData): Promise<void> {
        await test.step(`Fill second adult: ${data.firstName} ${data.lastName}`, async () => {
            const first = this.firstNameAdultInput.nth(1);
            if (!(await first.isVisible().catch(() => false))) {
                console.log('ℹ Second adult fields not visible – skipping');
                return;
            }

            // The second adult only has name / gender / date-of-birth fields
            // (no email, address or phone), so only those are filled here.
            await this.fillField(first, data.firstName);
            await this.fillField(this.lastNameAdultInput.nth(1), data.lastName);
            await this.selectGender(this.genderAdultSelect.nth(1), data.gender);

            const [yyyy, mm, dd] = data.dateOfBirth.split('-');
            await this.fillField(this.dateOfBirthDDInput.nth(1), dd);
            await this.fillField(this.dateOfBirthMMInput.nth(1), mm);
            await this.fillField(this.dateOfBirthYYYYInput.nth(1), yyyy);

            console.log(`✓ Second adult filled: ${data.firstName} ${data.lastName}`);
        });
    }

    /**
     * Fills the child's details. Skips gracefully if no child section is shown.
     */
    async fillChild(data: PassengerData): Promise<void> {
        await test.step(`Fill child: ${data.firstName} ${data.lastName}`, async () => {
            if (
                !(await this.firstNameKidInput
                    .first()
                    .isVisible()
                    .catch(() => false))
            ) {
                console.log('ℹ Child fields not visible – skipping');
                return;
            }

            await this.fillField(this.firstNameKidInput.first(), data.firstName);
            await this.fillField(this.lastNameKidInput.first(), data.lastName);

            await this.selectGender(this.genderKidSelect.first(), data.gender);

            // Child date of birth (third DOB widget on the page, if present)
            const [yyyy, mm, dd] = data.dateOfBirth.split('-');
            const kidDay = this.dateOfBirthDDInput.nth(2);
            if (await kidDay.isVisible().catch(() => false)) {
                await this.fillField(kidDay, dd);
                await this.fillField(this.dateOfBirthMMInput.nth(2), mm);
                await this.fillField(this.dateOfBirthYYYYInput.nth(2), yyyy);
            }

            console.log(`✓ Child filled: ${data.firstName} ${data.lastName}`);
        });
    }

    /**
     * Fills the mandatory "Informatie thuisblijver" (stay-at-home emergency
     * contact) section: last name and mobile number. Skips gracefully if the
     * section is not present on the page.
     */
    async fillStayHomeContact(data: PassengerData): Promise<void> {
        await test.step('Fill stay-at-home emergency contact', async () => {
            if (
                !(await this.stayHomeLastNameInput
                    .first()
                    .isVisible()
                    .catch(() => false))
            ) {
                console.log('ℹ Stay-at-home contact fields not visible – skipping');
                return;
            }
            await this.fillField(this.stayHomeLastNameInput.first(), data.lastName);
            await this.fillField(this.stayHomeMobileInput.first(), data.mobileNumber);
            console.log(`✓ Stay-at-home contact filled: ${data.lastName}`);
        });
    }

    /**
     * Fills every traveller in the booking: lead adult (required), plus an
     * optional second adult and child. Used by the happy-path / positive tests
     * where the search was configured for 2 adults + 1 child.
     */
    async fillAllTravellers(primary: PassengerData, secondAdult?: PassengerData, child?: PassengerData): Promise<void> {
        await test.step('Fill all traveller details', async () => {
            await this.fillTravelerDetails(primary);
            if (secondAdult) await this.fillSecondAdult(secondAdult);
            if (child) await this.fillChild(child);
            await this.fillStayHomeContact(primary);
        });
    }

    // ── Validation actions ────────────────────────────────────────────────────

    async triggerValidation(): Promise<void> {
        await test.step('Submit the form to trigger validation', async () => {
            await this.continueBtn.click();
        });
    }

    /**
     * Fills the traveller details with valid data and submits the form,
     * continuing to the next step of the booking flow.
     *
     * @param data - Generated or custom PassengerData object
     */
    async fillAndContinue(data: PassengerData): Promise<void> {
        await test.step(`Fill passenger details and continue`, async () => {
            await this.fillTravelerDetails(data);
            await this.clickContinue();
        });
    }

    async clickContinue(): Promise<void> {
        await test.step('Continue from passenger details', async () => {
            // The booking cannot proceed until the required terms & conditions
            // checkbox ("Ik ga akkoord met de algemene voorwaarden") is ticked.
            const termsCheckbox = this.page
                .locator(
                    'xpath=//input[@type="checkbox" and ancestor::*[contains(., "Ik ga akkoord met de algemene voorwaarden")]]',
                )
                .first();
            if (await termsCheckbox.isVisible().catch(() => false)) {
                await termsCheckbox.check({ force: true }).catch(() => {});
            }

            await this.continueBtn.first().scrollIntoViewIfNeeded();
            await expect(this.continueBtn.first()).toBeVisible();
            await this.continueBtn.first().click();
            await this.page.waitForLoadState('domcontentloaded');
            console.log(`✓ Passenger details submitted → ${this.page.url()}`);
        });
    }

    async assertErrorsVisible(): Promise<void> {
        await test.step('Verify required-field error messages are displayed', async () => {
            await expect(this.allErrorFieldMessages.first()).toBeVisible();
            const errors = await this.getVisibleErrorTexts();
            expect(errors.length, 'At least one error message should be visible after empty submit').toBeGreaterThan(0);
            await expect(this.mainErrorMessage, 'Main validation error message should be visible').toBeVisible();
            console.log(`✓ ${errors.length} error message(s) found:`);
            errors.forEach((e, i) => console.log(`   [${i + 1}] ${e}`));
        });
    }

    /**
     * Reads the main error banner (`.alerts__alertText`) and verifies that the
     * number of failed checks it reports matches the number of individual
     * field-level error messages currently shown.
     *
     * The banner typically states how many fields failed (e.g. "Controleer de
     * onderstaande 5 velden"). This guards against the banner count drifting
     * from the actual field errors.
     */
    async assertMainErrorMessageErrorCount(): Promise<void> {
        await test.step('Verify main error message reports the correct number of failed checks', async () => {
            await expect(this.mainErrorMessage, 'Main validation error message should be visible').toBeVisible();

            const mainText = ((await this.mainErrorMessage.textContent()) ?? '').trim();
            expect(mainText, 'Main error message text is empty').not.toBe('');

            const match = mainText.match(/\d+/);
            expect(match, `Could not find an error count in main message: "${mainText}"`).not.toBeNull();
            const reportedCount = match ? Number(match[0]) : 0;

            const fieldErrors = await this.getVisibleErrorTexts();
            const actualCount = fieldErrors.length;

            console.log(`ℹ Error count details:`);
            console.log(`   • Main error message : "${mainText}"`);
            console.log(`   • Reported in banner : ${reportedCount} failed check(s)`);
            console.log(`   • Field errors shown : ${actualCount} error message(s)`);
            fieldErrors.forEach((e, i) => console.log(`      [${i + 1}] ${e}`));

            expect(
                reportedCount,
                `Main message reports ${reportedCount} failed check(s) but ${actualCount} field error message(s) are visible: ${JSON.stringify(fieldErrors)}`,
            ).toBe(actualCount);

            console.log(`✓ Counts match: ${reportedCount} reported == ${actualCount} shown`);
        });
    }

    async getVisibleErrorTexts(): Promise<string[]> {
        const errors = await this.allErrorFieldMessages.all();
        const texts: string[] = [];
        for (const el of errors) {
            if (await el.isVisible()) {
                const text = ((await el.textContent()) ?? '').trim();
                if (text) texts.push(text);
            }
        }
        return texts;
    }

    async assertFieldError(fieldLocator: Locator, expectedText?: string): Promise<void> {
        const siblingError = fieldLocator.locator(
            'xpath=following-sibling::*[contains(@class,"error") or @role="alert"][1]',
        );
        const parentError = fieldLocator.locator(
            'xpath=parent::*[contains(@class,"field") or contains(@class,"form-group")]' +
                '//*[contains(@class,"error") or @role="alert"]',
        );

        let errorEl: Locator | null = null;

        if (await siblingError.isVisible().catch(() => false)) {
            errorEl = siblingError;
        } else if (await parentError.isVisible().catch(() => false)) {
            errorEl = parentError;
        }

        if (errorEl) {
            await expect(errorEl).toBeVisible();
            if (expectedText) {
                await expect(errorEl).toContainText(expectedText, { ignoreCase: true });
            }
        } else {
            await expect(this.allErrorFieldMessages.first()).toBeVisible();
        }
    }

    // ── Step-wrapped validation scenarios (called directly from spec) ──────────

    async validateMissingFirstName(): Promise<void> {
        await test.step('Validate: missing first name shows required-field error', async () => {
            await this.clearField(this.firstNameAdultInput.first());
            await this.firstNameAdultInput.first().click();
            await this.triggerValidation();
            await this.assertFieldError(this.firstNameAdultInput);
            const errors = await this.getVisibleErrorTexts();
            console.log(`✓ First name blank – errors: ${errors.join(' | ')}`);
        });
    }

    async validateMissingLastName(): Promise<void> {
        await test.step('Validate: missing last name shows required-field error', async () => {
            await this.clearField(this.lastNameAdultInput);
            await this.triggerValidation();
            await this.assertFieldError(this.lastNameAdultInput);
        });
    }

    async validateNumericFirstName(): Promise<void> {
        await test.step('Validate: numeric first name shows invalid-input error', async () => {
            await this.fillField(this.firstNameAdultInput, INVALID_PASSENGER_DATA.numericName);
            await this.triggerValidation();
            await this.assertFieldError(this.firstNameAdultInput);
            const errors = await this.getVisibleErrorTexts();
            console.log(`✓ Numeric name – errors: ${errors.join(' | ')}`);
        });
    }

    async validateSpecialCharLastName(): Promise<void> {
        await test.step('Validate: special characters in last name show invalid-input error', async () => {
            await this.fillField(this.lastNameAdultInput, INVALID_PASSENGER_DATA.specialCharName);
            await this.triggerValidation();
            await this.assertFieldError(this.lastNameAdultInput);
        });
    }

    async validateEmailNoAt(): Promise<void> {
        await test.step('Validate: email without "@" shows invalid-email error', async () => {
            await this.fillField(this.emailInput, INVALID_PASSENGER_DATA.emailNoAt);
            await this.triggerValidation();
            await this.assertFieldError(this.emailInput);
            const errors = await this.getVisibleErrorTexts();
            console.log(`✓ Invalid email (no @) – errors: ${errors.join(' | ')}`);
        });
    }

    async validateEmailNoTld(): Promise<void> {
        await test.step('Validate: email without TLD shows invalid-email error', async () => {
            await this.fillField(this.emailInput, INVALID_PASSENGER_DATA.emailNoTld);
            await this.triggerValidation();
            await this.assertFieldError(this.emailInput);
        });
    }

    async validateEmailWithSpaces(): Promise<void> {
        await test.step('Validate: email with spaces shows invalid-email error', async () => {
            await this.fillField(this.emailInput, INVALID_PASSENGER_DATA.emailWithSpaces);
            await this.triggerValidation();
            await this.assertFieldError(this.emailInput);
        });
    }

    async validatePhoneWithLetters(): Promise<void> {
        await test.step('Validate: phone number with letters shows invalid-phone error', async () => {
            await this.fillField(this.phoneInput, INVALID_PASSENGER_DATA.phoneLetters);
            await this.triggerValidation();
            await this.assertFieldError(this.phoneInput);
            const errors = await this.getVisibleErrorTexts();
            console.log(`✓ Invalid phone (letters) – errors: ${errors.join(' | ')}`);
        });
    }

    async validatePhoneTooShort(): Promise<void> {
        await test.step('Validate: phone number too short shows invalid-phone error', async () => {
            await this.fillField(this.phoneInput, INVALID_PASSENGER_DATA.phoneTooShort);
            await this.triggerValidation();
            await this.assertFieldError(this.phoneInput);
        });
    }

    async validateMissingDateOfBirth(): Promise<void> {
        await test.step('Validate: missing date of birth shows required-field error', async () => {
            const isVisible = await this.dateOfBirthDDInput.isVisible().catch(() => false);
            if (!isVisible) {
                console.log('ℹ Date of birth field not visible – skipping');
                return;
            }
            await this.clearField(this.dateOfBirthDDInput);
            await this.triggerValidation();
            await this.assertFieldError(this.dateOfBirthDDInput);
        });
    }

    async validateAllFieldsBlank(): Promise<void> {
        await test.step('Validate: submitting all fields blank shows multiple errors', async () => {
            for (const field of [
                this.firstNameAdultInput,
                this.lastNameAdultInput,
                this.emailInput,
                this.phoneInput,
                this.dateOfBirthDDInput,
            ]) {
                const visible = await field.isVisible().catch(() => false);
                if (visible) await this.clearField(field);
            }
            await this.triggerValidation();

            const errors = await this.getVisibleErrorTexts();
            expect(
                errors.length,
                `Expected multiple errors when all fields are blank, but got: ${JSON.stringify(errors)}`,
            ).toBeGreaterThan(1);
            console.log(`✓ ${errors.length} errors shown for blank form:`);
            errors.forEach((e, i) => console.log(`   [${i + 1}] ${e}`));
        });
    }
}

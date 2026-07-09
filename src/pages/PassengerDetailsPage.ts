import { Page, Locator, expect, test } from '@playwright/test';
import { INVALID_PASSENGER_DATA, PassengerData } from '../helpers/random';

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
  readonly loadingOverlay: Locator;

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
  readonly firstNameKid: Locator;
  readonly lastNameKid: Locator;
  readonly genderKidSelecr: Locator;


  // ── Address / contact fields ──────────────────────────────────────────────
  readonly landAdultDropdown: Locator;
  readonly streetNameInput: Locator;
  readonly houseNumberInput: Locator;
  readonly postalCodeInput: Locator;
  readonly mobileNumberIndexDropdown: Locator;
  readonly mobileNumberInput: Locator;


  // ── Form-level submit / continue ──────────────────────────────────────────
  readonly submitBtn: Locator;
  readonly continueBtn: Locator;

  // ── Validation error messages ─────────────────────────────────────────────
  readonly allErrorMessages: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly dateOfBirthError: Locator;
  readonly emailError: Locator;
  readonly phoneError: Locator;
  readonly genderError: Locator;
  readonly nationalityError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loadingOverlay = page.locator(
      '[class*="loading"], [class*="spinner"], [aria-busy="true"]'
    );

    this.pageHeading = page.locator(
      '[data-testid="passenger-heading"], ' +
      'h1:has-text("reiziger" i), ' +
      'h1:has-text("passenger" i), ' +
      'h1:has-text("gegevens" i), ' +
      'h1, h2'
    ).first();

    this.firstNameAdultInput = page.locator('input[id^="FIRSTNAMEADULT"]');

    this.lastNameAdultInput = page.locator('input[id^="SURNAMEADULT"]');
    this.genderAdultSelect = page.locator('select[id^="GENDERADULT"]')
    this.firstNameKid = page.locator('input[id^="FIRSTNAMECHILD"]');
    this.lastNameKid = page.locator('input[id^="LASTNAMECHILD"');
    this.genderKidSelecr = page.locator('select[id^="GENDERCHILD]');

    this.dateOfBirthDDInput = page.locator('.DateInput__field input[aria-label="day"]');
    this.dateOfBirthMMInput = page.locator('.DateInput__field input[aria-label="month"]');
    this.dateOfBirthYYYYInput = page.locator('.DateInput__field input[aria-label="year"]');

    this.nationalityAdultSelect = page.locator('select[id^="NATIONALITYADULT"], input[id^="NATIONALITYADULT"]');

    this.landAdultDropdown = page.locator('select[id^="COUNTRYADULT"], input[id^="COUNTRYADULT"]');

    this.streetNameInput = page.locator('input[id^="STREETADULT"]');

    this.houseNumberInput = page.locator('input[id^="HOUSENUMBERADULT"]');

    this.postalCodeInput = page.locator('input[id^="POSTALCODEADULT"]');

    this.mobileNumberIndexDropdown = page.locator('select[id^="MOBILENUMBERINDEXADULT"]');

    this.mobileNumberInput = page.locator('input[id^="MOBILENUMBERADULT"]');

    this.emailInput = page.locator('input[id^="EMAILADDRESSADULT"]');


    this.submitBtn = page.locator(
      '[data-testid="passenger-submit"], ' +
      'button[type="submit"], ' +
      'button:has-text("Bevestigen"), ' +
      'button:has-text("Confirm")'
    ).first();

    this.continueBtn = page.locator(
      '[data-testid="passenger-continue"], ' +
      'button:has-text("Doorgaan"), ' +
      'button:has-text("Verder"), ' +
      'button:has-text("Volgende"), ' +
      'button:has-text("Continue"), ' +
      '[class*="continue"]'
    ).first();

    // ── Error messages ─────────────────────────────────────────────────────
    this.allErrorMessages = page.locator(
      '.inputs__errorMessageWithIcon'
    );

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
      await this.loadingOverlay.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
      await this.pageHeading.waitFor({ state: 'visible', timeout: 20_000 });

      await expect(this.page).toHaveURL(
        /passenger|reizigers|gegevens|traveller|details/i,
        { timeout: 15_000 }
      ).catch(async () => {
        console.warn('  ⚠ URL pattern not matched; checking form fields directly');
        await expect(this.firstNameAdultInput).toBeVisible({ timeout: 10_000 });
      });

      const hasFirstName = await this.firstNameAdultInput.isVisible().catch(() => false);
      const hasLastName  = await this.lastNameAdultInput.isVisible().catch(() => false);
      expect(
        hasFirstName || hasLastName,
        'Passenger details form fields should be visible on the passenger page'
      ).toBe(true);

      console.log('✓ Passenger details page confirmed');
    });
  }

  // ── Form helpers ───────────────────────────────────────────────────────────

  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 8_000 });
    await locator.clear();
    await locator.fill(value);
  }

  async clearField(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 8_000 });
    await locator.clear();
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

      // ── Personal details ──────────────────────────────────────────────
      await test.step('Fill first name', async () => {
        await this.fillField(this.firstNameAdultInput.first(), data.firstName);
      });

      await test.step('Fill last name', async () => {
        await this.fillField(this.lastNameAdultInput.first(), data.lastName);
      });

      await test.step('Select gender', async () => {
        const genderVisible = await this.genderAdultSelect.first().isVisible().catch(() => false);
        if (genderVisible) {
          // radio buttons – click the one matching gender
          const genderValue = data.gender === 'male' ? 'M' : 'F';
          const radio = this.page.locator(
            `input[id^="GENDERADULT"][value="${genderValue}"], ` +
            `input[id^="GENDERADULT"][value="${data.gender}"]`
          ).first();
          if (await radio.isVisible().catch(() => false)) {
            await radio.click();
          }
        }
      });

      await test.step('Fill date of birth', async () => {
        const [yyyy, mm, dd] = data.dateOfBirth.split('-');
        if (await this.dateOfBirthDDInput.isVisible().catch(() => false)) {
          await this.fillField(this.dateOfBirthDDInput, dd);
        }
        if (await this.dateOfBirthMMInput.isVisible().catch(() => false)) {
          await this.fillField(this.dateOfBirthMMInput, mm);
        }
        if (await this.dateOfBirthYYYYInput.isVisible().catch(() => false)) {
          await this.fillField(this.dateOfBirthYYYYInput, yyyy);
        }
      });

      await test.step('Select nationality', async () => {
        const visible = await this.nationalityAdultSelect.first().isVisible().catch(() => false);
        if (visible) {
          await this.nationalityAdultSelect.first().selectOption(data.nationality).catch(async () => {
            await this.fillField(this.nationalityAdultSelect.first(), data.nationality);
          });
        }
      });

      // ── Contact details ───────────────────────────────────────────────
      await test.step('Fill email', async () => {
        const visible = await this.emailInput.isVisible().catch(() => false);
        if (visible) await this.fillField(this.emailInput, data.email);
      });

      await test.step('Fill phone', async () => {
        const visible = await this.phoneInput.isVisible().catch(() => false);
        if (visible) await this.fillField(this.phoneInput, data.phone);
      });

      // ── Address fields ────────────────────────────────────────────────
      await test.step('Select country', async () => {
        const visible = await this.landAdultDropdown.first().isVisible().catch(() => false);
        if (visible) {
          await this.landAdultDropdown.first().selectOption(data.country).catch(async () => {
            await this.fillField(this.landAdultDropdown.first(), data.country);
          });
        }
      });

      await test.step('Fill street name', async () => {
        const visible = await this.streetNameInput.first().isVisible().catch(() => false);
        if (visible) await this.fillField(this.streetNameInput.first(), data.streetName);
      });

      await test.step('Fill house number', async () => {
        const visible = await this.houseNumberInput.first().isVisible().catch(() => false);
        if (visible) await this.fillField(this.houseNumberInput.first(), data.houseNumber);
      });

      await test.step('Fill postal code', async () => {
        const visible = await this.postalCodeInput.first().isVisible().catch(() => false);
        if (visible) await this.fillField(this.postalCodeInput.first(), data.postalCode);
      });

      // ── Mobile number ─────────────────────────────────────────────────
      await test.step('Select mobile country code', async () => {
        const visible = await this.mobileNumberIndexDropdown.first().isVisible().catch(() => false);
        if (visible) {
          await this.mobileNumberIndexDropdown.first()
            .selectOption(data.mobileCountryCode).catch(async () => {
              await this.fillField(this.mobileNumberIndexDropdown.first(), data.mobileCountryCode);
            });
        }
      });

      await test.step('Fill mobile number', async () => {
        const visible = await this.mobileNumberInput.first().isVisible().catch(() => false);
        if (visible) await this.fillField(this.mobileNumberInput.first(), data.mobileNumber);
      });

      console.log(`✓ Traveler details filled: ${data.firstName} ${data.lastName}`);
    });
  }

  // ── Validation actions ────────────────────────────────────────────────────

  async triggerValidation(): Promise<void> {
    await test.step('Submit the form to trigger validation', async () => {
      const submitVisible = await this.submitBtn.isVisible().catch(() => false);
      if (submitVisible) {
        await this.submitBtn.click();
      } else {
        await this.continueBtn.click();
      }
      await this.page.waitForTimeout(1_000);
    });
  }

  async assertErrorsVisible(): Promise<void> {
    await test.step('Verify required-field error messages are displayed', async () => {
      await expect(this.allErrorMessages.first()).toBeVisible({ timeout: 8_000 });
      const errors = await this.getVisibleErrorTexts();
      expect(errors.length, 'At least one error message should be visible after empty submit').toBeGreaterThan(0);
      console.log(`✓ ${errors.length} error message(s) found:`);
      errors.forEach((e, i) => console.log(`   [${i + 1}] ${e}`));
    });
  }

  async getVisibleErrorTexts(): Promise<string[]> {
    const errors = await this.allErrorMessages.all();
    const texts: string[] = [];
    for (const el of errors) {
      if (await el.isVisible()) {
        const text = (await el.textContent() ?? '').trim();
        if (text) texts.push(text);
      }
    }
    return texts;
  }

  async assertFieldError(fieldLocator: Locator, expectedText?: string): Promise<void> {
    const siblingError = fieldLocator.locator(
      'xpath=following-sibling::*[contains(@class,"error") or @role="alert"][1]'
    );
    const parentError = fieldLocator.locator(
      'xpath=parent::*[contains(@class,"field") or contains(@class,"form-group")]' +
      '//*[contains(@class,"error") or @role="alert"]'
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
      await expect(this.allErrorMessages.first()).toBeVisible({ timeout: 8_000 });
    }
  }

  // ── Step-wrapped validation scenarios (called directly from spec) ──────────

  async validateMissingFirstName(): Promise<void> {
    await test.step('Validate: missing first name shows required-field error', async () => {
      await this.clearField(this.firstNameAdultInput);
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

  async validatePastPassportExpiry(): Promise<void> {
    await test.step('Validate: past passport expiry date shows invalid-date error', async () => {
      const isVisible = await this.passportExpiryInput.isVisible().catch(() => false);
      if (!isVisible) {
        console.log('ℹ Passport expiry field not visible – skipping');
        return;
      }
      await this.fillField(this.passportExpiryInput, INVALID_PASSENGER_DATA.pastDate);
      await this.triggerValidation();
      await this.assertFieldError(this.passportExpiryInput);
      const errors = await this.getVisibleErrorTexts();
      console.log(`✓ Past passport expiry – errors: ${errors.join(' | ')}`);
    });
  }

  async validateMissingPassportNumber(): Promise<void> {
    await test.step('Validate: missing passport number shows required-field error', async () => {
      const isVisible = await this.passportNumberInput.isVisible().catch(() => false);
      if (!isVisible) {
        console.log('ℹ Passport number field not visible – skipping');
        return;
      }
      await this.clearField(this.passportNumberInput);
      await this.triggerValidation();
      await this.assertFieldError(this.passportNumberInput);
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
        `Expected multiple errors when all fields are blank, but got: ${JSON.stringify(errors)}`
      ).toBeGreaterThan(1);
      console.log(`✓ ${errors.length} errors shown for blank form:`);
      errors.forEach((e, i) => console.log(`   [${i + 1}] ${e}`));
    });
  }
}

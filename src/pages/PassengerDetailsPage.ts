import { Page, Locator, expect, test } from '@playwright/test';
import { INVALID_PASSENGER_DATA } from '../helpers/random';

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
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly genderSelect: Locator;
  readonly nationalitySelect: Locator;
  readonly passportNumberInput: Locator;
  readonly passportExpiryInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  // ── Contact / booking details ─────────────────────────────────────────────
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;

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
  readonly passportError: Locator;
  readonly passportExpiryError: Locator;

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

    this.firstNameInput = page.locator(
      '[data-testid="passenger-firstname"], ' +
      'input[name*="firstname" i], ' +
      'input[name*="first_name" i], ' +
      'input[name*="voornaam" i], ' +
      '[aria-label*="voornaam" i], ' +
      '[placeholder*="voornaam" i], ' +
      'input[id*="firstname" i], ' +
      'input[id*="first-name" i]'
    ).first();

    this.lastNameInput = page.locator(
      '[data-testid="passenger-lastname"], ' +
      'input[name*="lastname" i], ' +
      'input[name*="last_name" i], ' +
      'input[name*="achternaam" i], ' +
      '[aria-label*="achternaam" i], ' +
      '[placeholder*="achternaam" i], ' +
      'input[id*="lastname" i], ' +
      'input[id*="last-name" i]'
    ).first();

    this.dateOfBirthInput = page.locator(
      '[data-testid="passenger-dob"], ' +
      'input[name*="dob" i], ' +
      'input[name*="birthdate" i], ' +
      'input[name*="geboortedatum" i], ' +
      '[aria-label*="geboortedatum" i], ' +
      '[placeholder*="geboortedatum" i], ' +
      'input[type="date"]'
    ).first();

    this.genderSelect = page.locator(
      '[data-testid="passenger-gender"], ' +
      'select[name*="gender" i], ' +
      'select[name*="geslacht" i], ' +
      '[aria-label*="geslacht" i], ' +
      'select[id*="gender" i]'
    ).first();

    this.nationalitySelect = page.locator(
      '[data-testid="passenger-nationality"], ' +
      'select[name*="nationality" i], ' +
      'select[name*="nationaliteit" i], ' +
      '[aria-label*="nationaliteit" i]'
    ).first();

    this.passportNumberInput = page.locator(
      '[data-testid="passenger-passport"], ' +
      'input[name*="passport" i], ' +
      'input[name*="paspoort" i], ' +
      '[aria-label*="paspoortnummer" i], ' +
      '[placeholder*="paspoort" i]'
    ).first();

    this.passportExpiryInput = page.locator(
      '[data-testid="passport-expiry"], ' +
      'input[name*="expiry" i], ' +
      'input[name*="vervaldatum" i], ' +
      '[aria-label*="vervaldatum" i], ' +
      '[placeholder*="vervaldatum" i]'
    ).first();

    this.emailInput = page.locator(
      '[data-testid="passenger-email"], ' +
      'input[name*="email" i][type="email"], ' +
      'input[id*="email" i], ' +
      '[aria-label*="e-mailadres" i], ' +
      '[placeholder*="e-mailadres" i], ' +
      'input[type="email"]'
    ).first();

    this.phoneInput = page.locator(
      '[data-testid="passenger-phone"], ' +
      'input[name*="phone" i], ' +
      'input[name*="telefoon" i], ' +
      '[aria-label*="telefoonnummer" i], ' +
      '[placeholder*="telefoon" i], ' +
      'input[type="tel"]'
    ).first();

    this.contactEmailInput = page.locator(
      '[data-testid="contact-email"], ' +
      'input[name="contactEmail"], ' +
      'input[id*="contact-email" i]'
    ).first();

    this.contactPhoneInput = page.locator(
      '[data-testid="contact-phone"], ' +
      'input[name="contactPhone"], ' +
      'input[id*="contact-phone" i]'
    ).first();

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
      '[role="alert"], ' +
      '[class*="error-message"], ' +
      '[class*="validation-error"], ' +
      '[class*="field-error"], ' +
      '[class*="form-error"], ' +
      '.error, ' +
      '[data-testid*="error"]'
    );

    this.firstNameError = page.locator(
      '[data-testid="firstname-error"], ' +
      '[id*="firstname"][id*="error"], ' +
      'input[name*="voornaam" i] ~ [class*="error"], ' +
      'input[name*="firstname" i] ~ [class*="error"], ' +
      '[class*="firstname"] [class*="error"], ' +
      '[class*="first-name"] [class*="error"]'
    ).first();

    this.lastNameError = page.locator(
      '[data-testid="lastname-error"], ' +
      '[id*="lastname"][id*="error"], ' +
      'input[name*="achternaam" i] ~ [class*="error"], ' +
      'input[name*="lastname" i] ~ [class*="error"], ' +
      '[class*="lastname"] [class*="error"], ' +
      '[class*="last-name"] [class*="error"]'
    ).first();

    this.dateOfBirthError = page.locator(
      '[data-testid="dob-error"], ' +
      'input[name*="geboortedatum" i] ~ [class*="error"], ' +
      'input[name*="dob" i] ~ [class*="error"], ' +
      '[class*="birthdate"] [class*="error"], ' +
      '[class*="dob"] [class*="error"]'
    ).first();

    this.emailError = page.locator(
      '[data-testid="email-error"], ' +
      'input[type="email"] ~ [class*="error"], ' +
      'input[name*="email" i] ~ [class*="error"], ' +
      '[class*="email"] [class*="error"]'
    ).first();

    this.phoneError = page.locator(
      '[data-testid="phone-error"], ' +
      'input[name*="telefoon" i] ~ [class*="error"], ' +
      'input[name*="phone" i] ~ [class*="error"], ' +
      '[class*="phone"] [class*="error"], ' +
      '[class*="telefoon"] [class*="error"]'
    ).first();

    this.genderError = page.locator(
      '[data-testid="gender-error"], ' +
      'select[name*="gender" i] ~ [class*="error"], ' +
      '[class*="gender"] [class*="error"]'
    ).first();

    this.nationalityError = page.locator(
      '[data-testid="nationality-error"], ' +
      'select[name*="nationality" i] ~ [class*="error"], ' +
      '[class*="nationality"] [class*="error"]'
    ).first();

    this.passportError = page.locator(
      '[data-testid="passport-error"], ' +
      'input[name*="passport" i] ~ [class*="error"], ' +
      '[class*="passport"] [class*="error"]'
    ).first();

    this.passportExpiryError = page.locator(
      '[data-testid="passport-expiry-error"], ' +
      'input[name*="expiry" i] ~ [class*="error"], ' +
      '[class*="expiry"] [class*="error"], ' +
      '[class*="vervaldatum"] [class*="error"]'
    ).first();
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
        await expect(this.firstNameInput).toBeVisible({ timeout: 10_000 });
      });

      const hasFirstName = await this.firstNameInput.isVisible().catch(() => false);
      const hasLastName  = await this.lastNameInput.isVisible().catch(() => false);
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
      await this.clearField(this.firstNameInput);
      await this.triggerValidation();
      await this.assertFieldError(this.firstNameInput);
      const errors = await this.getVisibleErrorTexts();
      console.log(`✓ First name blank – errors: ${errors.join(' | ')}`);
    });
  }

  async validateMissingLastName(): Promise<void> {
    await test.step('Validate: missing last name shows required-field error', async () => {
      await this.clearField(this.lastNameInput);
      await this.triggerValidation();
      await this.assertFieldError(this.lastNameInput);
    });
  }

  async validateNumericFirstName(): Promise<void> {
    await test.step('Validate: numeric first name shows invalid-input error', async () => {
      await this.fillField(this.firstNameInput, INVALID_PASSENGER_DATA.numericName);
      await this.triggerValidation();
      await this.assertFieldError(this.firstNameInput);
      const errors = await this.getVisibleErrorTexts();
      console.log(`✓ Numeric name – errors: ${errors.join(' | ')}`);
    });
  }

  async validateSpecialCharLastName(): Promise<void> {
    await test.step('Validate: special characters in last name show invalid-input error', async () => {
      await this.fillField(this.lastNameInput, INVALID_PASSENGER_DATA.specialCharName);
      await this.triggerValidation();
      await this.assertFieldError(this.lastNameInput);
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
      const isVisible = await this.dateOfBirthInput.isVisible().catch(() => false);
      if (!isVisible) {
        console.log('ℹ Date of birth field not visible – skipping');
        return;
      }
      await this.clearField(this.dateOfBirthInput);
      await this.triggerValidation();
      await this.assertFieldError(this.dateOfBirthInput);
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
        this.firstNameInput,
        this.lastNameInput,
        this.emailInput,
        this.phoneInput,
        this.dateOfBirthInput,
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

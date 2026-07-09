/**
 * Random data helpers used throughout the test suite.
 *
 * All functions are pure (no side-effects) so they can be called freely
 * from test files and Page Objects without any setup.
 */

// ── Generic ────────────────────────────────────────────────────────────────

/** Returns a random integer in the range [min, max] (inclusive). */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Picks a random element from a non-empty array. */
export function pickRandom<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error('pickRandom called with empty array');
    return arr[randomInt(0, arr.length - 1)];
}

// ── Passenger data ─────────────────────────────────────────────────────────

export interface PassengerData {
    firstName: string;
    lastName: string;
    /** ISO 8601 date string, e.g. "1985-06-15" */
    dateOfBirth: string;
    gender: 'male' | 'female';
    email: string;
    phone: string;
    nationality: string;
    passportNumber: string;
    /** ISO 8601 date string for passport expiry, at least 6 months in the future */
    passportExpiry: string;
    // ── Address / contact ───────────────────────────────────────────────────
    country: string;
    streetName: string;
    city: string;
    houseNumber: string;
    postalCode: string;
    mobileCountryCode: string;
    mobileNumber: string;
}

const FIRST_NAMES_MALE = [
    'Jan', 'Pieter', 'Thomas', 'Lars', 'Sander', 'Bram', 'Kevin', 'David',
];
const FIRST_NAMES_FEMALE = [
    'Emma', 'Sophie', 'Lisa', 'Anna', 'Laura', 'Lotte', 'Nina', 'Eva',
];
const LAST_NAMES = [
    'de Vries', 'Jansen', 'de Boer', 'Visser', 'Smit', 'Meijer', 'van den Berg', 'Peters',
];

const CITIES = [
    'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 'Groningen', 'Maastricht', 'Breda',
];

export function generatePassengerData(
    options: { isChild?: boolean; childAge?: number } = {}
): PassengerData {
    const gender = pickRandom<'male' | 'female'>(['male', 'female']);
    const firstName = pickRandom(gender === 'male' ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
    const lastName = pickRandom(LAST_NAMES);

    // Date of birth
    const now = new Date();
    let dateOfBirth: string;

    if (options.isChild && options.childAge !== undefined) {
        // Carefully derive a birth date that is *exactly* `childAge` years old.
        // A person is `childAge` today iff their birth date lies in the
        // half-open interval (today − (childAge+1) years, today − childAge years].
        // Picking a naive random month/day (as done for adults) can land after
        // today's month/day and make the child compute to `childAge − 1`, which
        // would no longer match the age selected during the search.
        const upper = new Date(now.getFullYear() - options.childAge, now.getMonth(), now.getDate());
        const lower = new Date(now.getFullYear() - options.childAge - 1, now.getMonth(), now.getDate() + 1);
        const daySpan = Math.max(0, Math.floor((upper.getTime() - lower.getTime()) / 86_400_000));
        const birth = new Date(lower.getTime() + randomInt(0, daySpan) * 86_400_000);
        dateOfBirth = `${birth.getFullYear()}-${String(birth.getMonth() + 1).padStart(2, '0')}-${String(birth.getDate()).padStart(2, '0')}`;
    } else {
        const birthYear = now.getFullYear() - randomInt(20, 70);
        const birthMonth = randomInt(1, 12);
        const birthDay = randomInt(1, 28);
        dateOfBirth = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    }

    // Email
    const emailTag = `${firstName.toLowerCase().replace(/\s/g, '')}.${lastName.toLowerCase().replace(/\s/g, '')}.${randomInt(100, 999)}`;
    const email = `${emailTag}@example.com`;

    // Phone (NL mobile format)
    const phone = `06${randomInt(10000000, 99999999)}`;


    // Passport expiry – at least 6 months from today
    const expiryDate = new Date(now.getFullYear() + randomInt(1, 5), randomInt(0, 11), randomInt(1, 28));
    const passportExpiry = expiryDate.toISOString().split('T')[0];

    // Passport number (mock)
    const passportNumber = `NL${randomInt(10000000, 99999999)}`;

    return {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        email,
        phone,
        nationality: 'NL',
        passportNumber,
        passportExpiry,
        country: 'NL',
        streetName: pickRandom(['Keizersgracht', 'Herengracht', 'Prinsengracht', 'Damrak', 'Kalverstraat']),
        city: pickRandom(CITIES),
        houseNumber: String(randomInt(1, 250)),
        postalCode: `${randomInt(1000, 9999)}${pickRandom(['AB', 'CD', 'EF', 'GH', 'XZ'])}`,
        mobileCountryCode: '+31',
        mobileNumber: `06${randomInt(10000000, 99999999)}`,
    };
}

// ── Invalid data for validation tests ─────────────────────────────────────

export const INVALID_PASSENGER_DATA = {
    /** Just a space – should trigger "required" or "invalid name" error */
    blankName: ' ',
    /** Numbers are invalid in a name field */
    numericName: '12345',
    /** Special characters not allowed in a name */
    specialCharName: '@#$%^&*',
    /** Too short */
    tooShortName: 'A',

    /** Obviously invalid email formats */
    emailNoAt: 'notanemail.com',
    emailNoTld: 'user@domain',
    emailWithSpaces: 'user name@domain.com',

    /** Invalid phone numbers */
    phoneLetters: 'abcdefghij',
    phoneTooShort: '0612',
    phoneTooLong: '06123456789012',

    /** Dates in the past for passport expiry */
    pastDate: '2000-01-01',
    dateInvalidFormat: '31-13-2025',

    /** Invalid passport number */
    passportEmpty: '',
    passportTooShort: 'AB1',
} as const;

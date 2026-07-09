/* ESLint configuration for the TUI.nl Playwright automation suite.
 * Uses @typescript-eslint for type-aware linting and Prettier for formatting.
 */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    env: {
        node: true,
        es2020: true,
    },
    ignorePatterns: [
        'node_modules',
        'dist',
        'playwright-report',
        'test-results',
        'playwright.config.ts',
    ],
    rules: {
        // Dead code is a showcase red flag — fail the build on it.
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        // Allow empty catch blocks used for best-effort waits/cleanup.
        'no-empty': ['error', { allowEmptyCatch: true }],
        // Keep `any` visible but non-blocking for a test suite.
        '@typescript-eslint/no-explicit-any': 'warn',
        // Surface (but don't fail on) non-null assertions.
        '@typescript-eslint/no-non-null-assertion': 'warn',
        'prettier/prettier': 'error',
    },
};

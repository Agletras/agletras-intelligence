// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'

/**
 * Agletras ESLint flat configuration.
 *
 * Scope: correctness and accessibility guards only. No stylistic rules —
 * formatting is owned by Prettier (see .prettierrc.mjs) so the two tools never
 * disagree about the same line (AGENTS.md rule 8: single owner per concern).
 */
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro files. Astro's own recommended ruleset covers .astro frontmatter,
  // client directives and a11y-relevant markup problems.
  ...astro.configs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  {
    // Project-owned source. TypeScript rules that protect correctness but are
    // noisy in application code.
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // Empty catch blocks are a real defect signal for a site that must
      // degrade gracefully (3D/WebGL fallback, contact copy-to-clipboard).
      'no-empty': ['error', { allowEmptyCatch: false }],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  },

  {
    // Node-side tooling and test scripts run in Node, not the browser. The
    // browser globals are deliberately NOT granted here, so an accidental
    // `document` or `fetch` in a build/test script is caught rather than
    // silently shipping.
    files: ['*.mjs', '**/*.config.mjs', 'tests/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Scripts are allowed to report progress on stdout/stderr.
      'no-console': 'off',
    },
  },
)

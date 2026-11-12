/** @type {import('prettier').Config} */
export default {
  printWidth: 100,
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  // Registered explicitly. Prettier 3 no longer auto-discovers plugins, and
  // .astro files cannot be parsed without it.
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
    {
      files: ['*.md', '*.json', '*.yml', '*.yaml'],
      options: { tabWidth: 2 },
    },
  ],
}

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')

console.log('Testing ethical non-intrusion and legal boundary disclosures...')

const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
const termsHtml = fs.readFileSync(path.join(distDir, 'terms/index.html'), 'utf8')
const privacyHtml = fs.readFileSync(path.join(distDir, 'privacy/index.html'), 'utf8')
const aboutHtml = fs.readFileSync(path.join(distDir, 'about/index.html'), 'utf8')

// Assert non-intrusion charter exists across key pages
const nonIntrusionTerms = [
  'penetration testing',
  'unauthorized network intrusion',
  'open-source intelligence',
]

for (const term of nonIntrusionTerms) {
  assert(
    termsHtml.toLowerCase().includes(term.toLowerCase()),
    `Terms of Engagement must contain ethical boundary: "${term}"`
  )
  assert(
    aboutHtml.toLowerCase().includes(term.toLowerCase()),
    `About page must contain ethical boundary: "${term}"`
  )
}

assert(
  indexHtml.includes('OPERATIONAL BOUNDARY & NON-INTRUSION CHARTER'),
  'Homepage footer must contain the Operational Boundary & Non-Intrusion Charter'
)

assert(
  privacyHtml.includes('SHA-256'),
  'Privacy policy must disclose cryptographic SHA-256 evidence hashing'
)

console.log('✓ All ethical boundaries and non-intrusion guarantees verified across distribution.')

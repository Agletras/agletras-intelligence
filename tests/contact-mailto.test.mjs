import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('Testing Complete Removal of mailto: Links & Plain-Text Email Preservation...')

const contactSourcePath = path.resolve(process.cwd(), 'src/pages/contact.astro')
const contactSource = fs.readFileSync(contactSourcePath, 'utf8')

// 1. Verify complete absence of mailto: links in contact.astro
assert(
  !contactSource.includes('mailto:'),
  'contact.astro must NOT contain any mailto: links'
)
assert(
  !contactSource.includes('href="mailto:'),
  'contact.astro must NOT contain href attribute targeting mailto'
)

// 2. Verify complete absence of programmatic email-launching handlers or scripts
assert(
  !contactSource.includes('window.location.href'),
  'contact.astro must NOT contain programmatic email-launching location handlers'
)
assert(
  !contactSource.includes('window.open'),
  'contact.astro must NOT contain window.open handlers'
)
assert(
  !contactSource.includes('<script>'),
  'contact.astro must NOT contain any script tags or event handlers'
)

// 3. Verify company email remains preserved as plain, non-clickable text
assert(
  contactSource.includes('companyData.contacts.corporateEmail'),
  'contact.astro must display verified corporate email reference'
)
assert(
  contactSource.includes('<span class="channel-email'),
  'contact.astro must wrap corporate email in a plain non-clickable span'
)
assert(
  !contactSource.includes('<a class="channel-email"') && !contactSource.includes('<a href=`mailto:'),
  'contact.astro must NOT wrap corporate email in an anchor link'
)

// 4. Verify official GitHub and LinkedIn links are preserved
assert(
  contactSource.includes('companyData.contacts.socials.github'),
  'contact.astro must preserve official GitHub repository link'
)
assert(
  contactSource.includes('companyData.contacts.socials.linkedin'),
  'contact.astro must preserve official LinkedIn profile link'
)

// 5. Verify absence of any form or backend infrastructure
const forbiddenTerms = [
  'id="scoping-form"',
  'DIRECT_MAILTO_PROTOCOL',
  'RESEARCH SCOPING INTAKE SPECIFICATION',
  'workers.dev',
  'Cloudflare Worker',
  'Gmail API',
  'formsubmit.co',
  '/api/inquiry',
]

for (const term of forbiddenTerms) {
  assert(
    !contactSource.includes(term),
    `contact.astro must NOT contain removed form or backend reference: "${term}"`
  )
}

// 6. Verify dist/contact/index.html rendered output
const distContactPath = path.resolve(process.cwd(), 'dist/contact/index.html')
if (fs.existsSync(distContactPath)) {
  const distContact = fs.readFileSync(distContactPath, 'utf8')
  assert(
    distContact.includes('info.agletras@gmail.com'),
    'dist/contact/index.html must display plain-text email info.agletras@gmail.com'
  )
  assert(
    !distContact.includes('<a href="mailto:info.agletras@gmail.com" class="channel-email'),
    'dist/contact/index.html channel-email must NOT be a clickable mailto: link'
  )
  assert(
    distContact.includes('<span class="channel-email text-primary font-bold"'),
    'dist/contact/index.html must render channel-email as plain text element'
  )
  assert(
    !distContact.includes('<a class="channel-email"'),
    'dist/contact/index.html channel-email must NOT be an anchor tag'
  )
}

console.log('✓ All mailto removal verifications and plain-text email checks passed successfully.')

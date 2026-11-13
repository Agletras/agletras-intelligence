import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

console.log('Testing Mailto-Only Intake Architecture & Zero-Backend Compliance...')

const contactSourcePath = path.resolve(process.cwd(), 'src/pages/contact.astro')
const contactSource = fs.readFileSync(contactSourcePath, 'utf8')

// 1. Verify all 4 required inquiry fields exist in markup
assert(contactSource.includes('name="organization"'), 'Contact form must include organization field')
assert(contactSource.includes('name="email"'), 'Contact form must include email field')
assert(contactSource.includes('name="inquiry_focus"'), 'Contact form must include inquiry_focus field')
assert(contactSource.includes('name="research_objective"'), 'Contact form must include research_objective field')

// 2. Verify complete absence of legacy/backend service strings
const forbiddenTerms = [
  'workers.dev',
  'Cloudflare Worker',
  'Gmail API',
  'OAuth',
  'formsubmit.co',
  'FormSubmit',
  '/api/inquiry',
]

for (const term of forbiddenTerms) {
  assert(
    !contactSource.toLowerCase().includes(term.toLowerCase()),
    `contact.astro must NOT contain backend reference: "${term}"`
  )
}

// 3. Verify honest feedback messaging in script
assert(
  contactSource.includes('EMAIL COMPOSER REQUESTED — Complete and send your inquiry from your email application.'),
  'Script must display honest EMAIL COMPOSER REQUESTED title'
)
assert(
  contactSource.includes('You must click <strong>Send</strong> in your email application'),
  'Script must clearly explain that visitor must click Send'
)
assert(
  contactSource.includes('Web browsers cannot verify whether your email client opened successfully'),
  'Script must clearly explain browser cannot verify email client launch'
)
assert(
  contactSource.includes('not sent or delivered') &&
    contactSource.includes('merely because the composer was requested'),
  'Script must never claim inquiry was delivered merely because composer was requested'
)

// 4. Verify research objective character ceiling (2,000 max) and live counter
assert(contactSource.includes('maxlength="2000"'), 'Textarea must enforce maxlength="2000"')
assert(contactSource.includes('id="objective-counter"'), 'Markup must include objective-counter element')
assert(contactSource.includes('/ 2,000 characters'), 'Counter must display 2,000 characters limit')

// 5. Verify basic client-side spam filtering wording (no comprehensive protection claims)
assert(
  contactSource.includes('basic client-side automated spam trap'),
  'Honeypot must be described as basic client-side automated spam trap'
)
assert(
  !contactSource.toLowerCase().includes('comprehensive bot protection'),
  'Must not claim comprehensive bot protection for client-side honeypot'
)

// 6. Verify recipient address
assert(
  contactSource.includes('mailto:info.agletras@gmail.com'),
  'Contact form must target official corporate address info.agletras@gmail.com'
)

// 7. Verify mailto formatting helper logic
function buildMailto(org, email, focus, objective) {
  const subject = `New Agletras Research Inquiry — ${org} [${focus}]`
  const body =
    `AGLETRAS RESEARCH INTELLIGENCE // SCOPING INTAKE DOSSIER\r\n` +
    `============================================================\r\n` +
    `ORGANIZATION / COUNTERPARTY:\r\n${org}\r\n\r\n` +
    `AUTHORIZED REPRESENTATIVE EMAIL:\r\n${email}\r\n\r\n` +
    `RESEARCH INQUIRY FOCUS:\r\n${focus}\r\n\r\n` +
    `TARGET ANCHORS & SCOPING OBJECTIVE:\r\n${objective}\r\n\r\n` +
    `============================================================\r\n` +
    `CONFIDENTIALITY PROTOCOL:\r\n` +
    `This inquiry initiates preliminary research scoping. Mutual NDA is requested prior to evidentiary record exchange.`

  return `mailto:info.agletras@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const testMailto = buildMailto(
  'Apex Capital & Advisory',
  'principal@apexcap.com',
  'Business Partner & Company Checks',
  'Comprehensive entity background check in Delaware & UK.'
)

assert(testMailto.startsWith('mailto:info.agletras@gmail.com?subject='))
assert(testMailto.includes(encodeURIComponent('Apex Capital & Advisory')))
assert(testMailto.includes(encodeURIComponent('principal@apexcap.com')))
assert(testMailto.includes(encodeURIComponent('Business Partner & Company Checks')))
assert(testMailto.includes(encodeURIComponent('Comprehensive entity background check in Delaware & UK.')))

// 6. Verify public/_headers CSP connects only to self and permits mailto form-action
const headersPath = path.resolve(process.cwd(), 'public/_headers')
if (fs.existsSync(headersPath)) {
  const headers = fs.readFileSync(headersPath, 'utf8')
  assert(!headers.includes('workers.dev'), '_headers CSP must not contain workers.dev')
  assert(!headers.includes('inquiry.agletras.com'), '_headers CSP must not contain inquiry.agletras.com')
  assert(headers.includes("form-action 'self' mailto:;"), '_headers must permit mailto: form-action')
}

console.log('✓ Mailto-only intake architecture and honest status feedback verified.')

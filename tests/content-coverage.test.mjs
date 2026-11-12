import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')

console.log('Testing content coverage across consolidated distribution...')

// 1. Homepage verification
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
assert(indexHtml.includes('Intelligence is only as strong as its evidence.'), 'Homepage must feature approved final hero headline')
assert(indexHtml.includes('Connect AI Agents to Evidence-Driven Intelligence'), 'Homepage must feature approved architecture capability headline')
assert(indexHtml.includes('Agletras Intelligence'), 'Homepage must introduce Agletras Intelligence')
assert(indexHtml.includes('Human-Led Research') || indexHtml.includes('human-led corporate intelligence'), 'Homepage must introduce human-led corporate intelligence')
assert(indexHtml.includes('well-supported findings'), 'Homepage must use approved phrasing: well-supported findings')
assert(!indexHtml.includes('defensible findings'), 'Homepage must NOT contain jargon: defensible findings')
assert(indexHtml.includes('href="/contact"') || indexHtml.includes('href="/agletras-intelligence/contact"') || indexHtml.includes('href="/Newwe-agle/contact"'), 'Homepage must link to Contact page')
assert(indexHtml.includes('href="/intelligence"') || indexHtml.includes('href="/agletras-intelligence/intelligence"') || indexHtml.includes('href="/Newwe-agle/intelligence"'), 'Homepage must link to Intelligence page')
console.log('✓ Homepage clean, focused structure verified.')

// 2. Unified Intelligence page verification (dist/intelligence/index.html)
const intelHtmlPath = path.join(distDir, 'intelligence/index.html')
assert(fs.existsSync(intelHtmlPath), 'dist/intelligence/index.html must exist')
const intelHtml = fs.readFileSync(intelHtmlPath, 'utf8')

// 2a. Section 1: What We Do
assert(intelHtml.includes('WHAT WE DO'), 'Intelligence page must have What We Do section')
assert(intelHtml.includes('Agletras Intelligence combines automated research'), 'Intelligence page must have clear company introduction')
assert(intelHtml.includes('well-supported findings'), 'Intelligence page must use approved phrasing: well-supported findings')
assert(!intelHtml.includes('defensible findings'), 'Intelligence page must NOT contain jargon: defensible findings')

// 2b. Section 2: Three simple capabilities
const requiredCapabilities = [
  'Research information',
  'Collect and check evidence',
  'Connect information to produce useful insights',
]
for (const cap of requiredCapabilities) {
  assert(intelHtml.includes(cap), `Intelligence page must display core capability: ${cap}`)
}
console.log('✓ All 3 simplified capabilities verified present on /intelligence.')

// 2c. Section 3: Four research services (one short sentence each)
const researchServices = [
  'Business Partner &amp; Company Checks',
  'Company Ownership &amp; Relationships',
  'Leadership Background &amp; Online Exposure',
  'Online Threats &amp; Brand Impersonation',
]
for (const r of researchServices) {
  const present = intelHtml.includes(r) || intelHtml.includes(r.replace('&amp;', '&'))
  assert(present, `Intelligence page must display research service: ${r}`)
}
console.log('✓ All 4 research services verified present on /intelligence.')

// 2d. Section 4: Contact CTA
assert(
  intelHtml.includes('href="/contact"') || intelHtml.includes('href="/agletras-intelligence/contact"') || intelHtml.includes('href="/Newwe-agle/contact"'),
  'Intelligence page must have a clear contact CTA'
)

// 2e. Clean, minimal presentation: absence of technical clutter and removed diagrams
assert(!intelHtml.includes('40 registered tools'), 'Intelligence page must NOT display 40 registered tools clutter')
assert(!intelHtml.includes('PRIMARY RECORDS'), 'Intelligence page must NOT contain detailed evidence standard cards')
assert(!intelHtml.includes('process-banner'), 'Intelligence page must NOT contain methodology process diagram')
assert(!intelHtml.includes('opencode.json'), 'Intelligence page must NOT contain verbose client JSON configuration blocks')
assert(intelHtml.includes('https://github.com/Agletras/Agletras-mcp.git'), 'Intelligence page must provide optional GitHub link')
console.log('✓ Clean presentation confirmed: evidence standards cards, process diagrams, and technical clutter eliminated.')

// 3. Verify complete removal of Statutory Registration panel and MSME branding
const aboutHtml = fs.readFileSync(path.join(distDir, 'about/index.html'), 'utf8')
const navbarHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
assert(!aboutHtml.includes('Ministry of Micro, Small and Medium Enterprises'), 'About page must NOT cite MSME Government of India')
assert(!aboutHtml.includes('CORPORATE IDENTITY & STATUTORY RECOGNITION'), 'About page must NOT contain statutory registration panel')
assert(!navbarHtml.includes('MSME REGISTERED'), 'Navbar must NOT contain MSME REGISTERED badge')
assert(aboutHtml.includes('NASHIK, MH, INDIA'), 'About page must cite official jurisdiction')
console.log('✓ Verified complete removal of Statutory Registration panel and MSME branding.')

// 4. Honest contact mailto in contact/index.html
const contactHtml = fs.readFileSync(path.join(distDir, 'contact/index.html'), 'utf8')
assert(contactHtml.includes('info.agletras@gmail.com'), 'Contact page must include verified corporate email info.agletras@gmail.com')
assert(!contactHtml.includes('contact@agletras.com'), 'Contact page must NOT include unrouted contact@agletras.com')
assert(!contactHtml.includes('pranavbpawar13@gmail.com'), 'Contact page must NOT include private owner email')
assert(contactHtml.includes('mailto:'), 'Contact form must use honest mailto protocol')
console.log('✓ Honest contact dispatch protocol with standardized info.agletras@gmail.com verified.')

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')

console.log('Testing build output structure in dist...')
assert(fs.existsSync(distDir), 'dist directory must exist')

const requiredFiles = [
  'index.html',
  'intelligence/index.html',
  'about/index.html',
  'contact/index.html',
  'terms/index.html',
  'privacy/index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'logo.png',
  // Backward-compatible redirect routes
  'research/index.html',
  'methodology/index.html',
  'mcp/index.html',
  'approach/index.html',
]

// 1. Verify canonical route definition in src/lib/routes.ts
const routesSource = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/routes.ts'), 'utf8')
assert(
  routesSource.includes("intelligence: (): string => withBase('/intelligence')") ||
    routesSource.includes("intelligence: () => withBase('/intelligence')") ||
    routesSource.includes("intelligence:"),
  "paths must define canonical intelligence route"
)
assert(routesSource.includes("paths.intelligence()"), "allRoutes must include paths.intelligence()")

// 2. Verify Navbar and Footer use canonical paths.intelligence()
const navbarSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/layout/Navbar.astro'), 'utf8')
assert(navbarSource.includes("href: paths.intelligence()"), "Navbar must link to canonical paths.intelligence()")

const footerSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/layout/Footer.astro'), 'utf8')
assert(footerSource.includes("href={paths.intelligence()}"), "Footer must link to canonical paths.intelligence()")

for (const file of requiredFiles) {
  const fullPath = path.join(distDir, file)
  assert(fs.existsSync(fullPath), `Required output file ${file} must exist in dist`)
  const stat = fs.statSync(fullPath)
  assert(stat.size > 0, `File ${file} must not be empty (was ${stat.size} bytes)`)
}

// 3. Verify sitemap.xml routes
const sitemapContent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8')

const defaultSite = 'https://hrudyanshkayastha.github.io'
const testSiteOrigin = (process.env.SITE_URL?.trim() ? new URL(process.env.SITE_URL.trim()).origin : defaultSite).replace(/\/+$/, '')
const testBasePath = process.env.BASE_PATH !== undefined
  ? (process.env.BASE_PATH.trim() === '/' || process.env.BASE_PATH.trim() === '' ? '' : process.env.BASE_PATH.trim().replace(/\/+$/, ''))
  : '/agletras-intelligence'
const testFullSiteUrl = `${testSiteOrigin}${testBasePath}`

const expectedSitemapRoutes = [
  testFullSiteUrl,
  `${testFullSiteUrl}/intelligence`,
  `${testFullSiteUrl}/about`,
  `${testFullSiteUrl}/contact`,
  `${testFullSiteUrl}/privacy`,
  `${testFullSiteUrl}/terms`,
]
for (const route of expectedSitemapRoutes) {
  assert(sitemapContent.includes(`<loc>${route}</loc>`), `sitemap.xml must include canonical route: ${route}`)
}

// Redirect and alias routes must NOT be in sitemap
const excludedSitemapRoutes = [
  `${testFullSiteUrl}/approach`,
  `${testFullSiteUrl}/research`,
  `${testFullSiteUrl}/methodology`,
  `${testFullSiteUrl}/mcp`,
]
for (const route of excludedSitemapRoutes) {
  assert(!sitemapContent.includes(`<loc>${route}</loc>`), `sitemap.xml must NOT include redirect route: ${route}`)
}

console.log(`✓ All ${requiredFiles.length} required static entrypoints exist and have non-zero size. Sitemap verified.`)

// Verify that removed service routes are strictly NOT published
const forbiddenFiles = [
  'services/index.html',
  'services/osint-investigation/index.html',
  'services/business-due-diligence/index.html',
  'services/recruitment-verification/index.html',
  'services/brand-impersonation-scam-research/index.html',
  'services/cyber-threat-intelligence/index.html',
  'services/research-automation/index.html',
]

for (const file of forbiddenFiles) {
  const fullPath = path.join(distDir, file)
  assert(!fs.existsSync(fullPath), `Removed service file ${file} must NOT exist in dist`)
}

console.log(`✓ Verified that all 7 removed service routes are no longer published in dist.`)

// 4. Verify Cloudflare Pages edge configuration files
const redirectsPath = path.join(distDir, '_redirects')
assert(fs.existsSync(redirectsPath), 'dist/_redirects must exist for Cloudflare Pages')
const redirectsContent = fs.readFileSync(redirectsPath, 'utf8')
const expectedRedirects = ['/approach', '/research', '/methodology', '/mcp']
for (const r of expectedRedirects) {
  assert(redirectsContent.includes(r) && redirectsContent.includes('/intelligence') && redirectsContent.includes('301'), `_redirects must contain 301 redirect for ${r}`)
}

const headersPath = path.join(distDir, '_headers')
assert(fs.existsSync(headersPath), 'dist/_headers must exist for Cloudflare Pages')
const headersContent = fs.readFileSync(headersPath, 'utf8')
assert(headersContent.includes('X-Content-Type-Options: nosniff'), '_headers must contain X-Content-Type-Options')
assert(headersContent.includes('X-Frame-Options: DENY'), '_headers must contain X-Frame-Options')
console.log('✓ Cloudflare Pages _redirects and _headers verified present and configured.')

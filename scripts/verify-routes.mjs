import http from 'node:http'

const canonicalRoutes = [
  '/',
  '/intelligence',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/404',
  '/robots.txt',
  '/sitemap.xml',
  // Backward-compatible redirect routes:
  '/research',
  '/methodology',
  '/mcp',
  '/approach',
]

const removedRoutes = [
  '/services',
  '/services/osint-investigation',
  '/services/business-due-diligence',
  '/services/recruitment-verification',
  '/services/brand-impersonation-scam-research',
  '/services/cyber-threat-intelligence',
  '/services/research-automation',
]

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:4322${path}`, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          sizeBytes: data.length,
          ok: res.statusCode === 200 || (path === '/404' && (res.statusCode === 200 || res.statusCode === 404)),
        })
      })
    }).on('error', (err) => {
      resolve({ path, statusCode: 'ERR', error: err.message, ok: false })
    })
  })
}

async function main() {
  console.log('--- VERIFYING REMAINING CANONICAL ROUTES OVER HTTP ---')
  let passed = 0
  for (const r of canonicalRoutes) {
    const res = await checkRoute(r)
    const icon = res.ok ? '✓' : '✗'
    console.log(`${icon} [${res.statusCode}] ${r.padEnd(45)} (${res.sizeBytes || 0} bytes)`)
    if (res.ok) passed++
  }
  console.log(`\nResult: ${passed}/${canonicalRoutes.length} canonical routes passed verification.`)

  console.log('\n--- VERIFYING REMOVED SERVICES ROUTES RETURN 404 ---')
  let removedPassed = 0
  for (const r of removedRoutes) {
    const res = await checkRoute(r)
    const isUnpublished = res.statusCode === 404
    const icon = isUnpublished ? '✓' : '✗'
    console.log(`${icon} [${res.statusCode}] ${r.padEnd(45)} (Expected 404 Not Found)`)
    if (isUnpublished) removedPassed++
  }
  console.log(`\nResult: ${removedPassed}/${removedRoutes.length} removed routes verified 404.\n`)

  if (passed !== canonicalRoutes.length || removedPassed !== removedRoutes.length) {
    process.exit(1)
  }
}

main()

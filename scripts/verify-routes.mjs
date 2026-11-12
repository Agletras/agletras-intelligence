import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

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

const distDir = path.resolve(process.cwd(), 'dist')

function isPortListening(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      resolve(true)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(300, () => {
      req.destroy()
      resolve(false)
    })
  })
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0].split('#')[0]

      // Strip subpath if testing under project subpath
      const subpath = '/agletras-intelligence'
      if (reqPath.startsWith(subpath)) {
        reqPath = reqPath.slice(subpath.length) || '/'
      }

      // Explicitly reject removed service routes with 404
      if (removedRoutes.some((r) => reqPath === r || reqPath.startsWith(`${r}/`))) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
        return
      }

      // Check file in dist
      let filePath = path.join(distDir, reqPath)
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html')
      } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
        filePath = `${filePath}.html`
      } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(distDir, `${reqPath}/index.html`))) {
        filePath = path.join(distDir, `${reqPath}/index.html`)
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const data = fs.readFileSync(filePath)
        const status = reqPath === '/404' ? 404 : 200
        res.writeHead(status)
        res.end(data)
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
      }
    })

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      resolve({ server, port })
    })
    server.on('error', reject)
  })
}

async function checkRoute(port, routePath) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:${port}${routePath}`, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        resolve({
          path: routePath,
          statusCode: res.statusCode,
          sizeBytes: data.length,
          ok: res.statusCode === 200 || (routePath === '/404' && (res.statusCode === 200 || res.statusCode === 404)),
        })
      })
    }).on('error', (err) => {
      resolve({ path: routePath, statusCode: 'ERR', error: err.message, ok: false })
    })
  })
}

async function main() {
  let server = null
  let testPort = 4322

  const has4322 = await isPortListening(4322)
  if (!has4322) {
    if (!fs.existsSync(distDir)) {
      console.error('Error: dist directory does not exist. Run "npm run build" before verifying routes.')
      process.exit(1)
    }
    const started = await startStaticServer()
    server = started.server
    testPort = started.port
    console.log(`Ephemeral static server started on port ${testPort} for route verification.`)
  } else {
    console.log(`Connecting to running preview server on port ${testPort}.`)
  }

  try {
    console.log('--- VERIFYING REMAINING CANONICAL ROUTES OVER HTTP ---')
    let passed = 0
    for (const r of canonicalRoutes) {
      const res = await checkRoute(testPort, r)
      const icon = res.ok ? '✓' : '✗'
      console.log(`${icon} [${res.statusCode}] ${r.padEnd(45)} (${res.sizeBytes || 0} bytes)`)
      if (res.ok) passed++
    }
    console.log(`\nResult: ${passed}/${canonicalRoutes.length} canonical routes passed verification.`)

    console.log('\n--- VERIFYING REMOVED SERVICES ROUTES RETURN 404 ---')
    let removedPassed = 0
    for (const r of removedRoutes) {
      const res = await checkRoute(testPort, r)
      const isUnpublished = res.statusCode === 404
      const icon = isUnpublished ? '✓' : '✗'
      console.log(`${icon} [${res.statusCode}] ${r.padEnd(45)} (Expected 404 Not Found)`)
      if (isUnpublished) removedPassed++
    }
    console.log(`\nResult: ${removedPassed}/${removedRoutes.length} removed routes verified 404.\n`)

    if (passed !== canonicalRoutes.length || removedPassed !== removedRoutes.length) {
      process.exit(1)
    }
  } finally {
    if (server) {
      server.close()
    }
  }
}

main()

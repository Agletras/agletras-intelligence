import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const EXPECTED_HASH = 'df200ad951c08c78c936f5a4d7cd6c981c0c879e0df75dafc332d1d89e788b30'

function hashFile(filePath) {
  const buffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(buffer).digest('hex').toLowerCase()
}

console.log('Testing authentic Agletras logo checksum integrity...')

const publicLogo = path.resolve(process.cwd(), 'public/logo.png')
const distLogo = path.resolve(process.cwd(), 'dist/logo.png')

assert(fs.existsSync(publicLogo), 'public/logo.png must exist')
assert(fs.existsSync(distLogo), 'dist/logo.png must exist')

const publicHash = hashFile(publicLogo)
const distHash = hashFile(distLogo)

console.log(`Public logo hash: ${publicHash}`)
console.log(`Dist logo hash:   ${distHash}`)
console.log(`Expected hash:    ${EXPECTED_HASH}`)

assert.strictEqual(publicHash, EXPECTED_HASH, 'public/logo.png hash must exactly match source truth')
assert.strictEqual(distHash, EXPECTED_HASH, 'dist/logo.png hash must exactly match source truth')

console.log('✓ Authentic Agletras logo verified byte-identical in public and dist.')

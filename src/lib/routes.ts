/**
 * Canonical route model.
 *
 * SINGLE SOURCE OF TRUTH for every internal path in the site. Pages, the
 * navigation, the sitemap and the 404 page all derive paths from here so
 * a route can never drift between them.
 */

/**
 * Build-time site origin validation.
 *
 * Validates and normalizes SITE_URL build-time configuration. Fails safely
 * with a descriptive error when an invalid origin or protocol is provided.
 * Defaults to 'https://hrudyanshkayastha.github.io' unless explicitly configured.
 */
export function resolveSiteUrl(raw?: string): string {
  if (raw === undefined || raw === null || raw.trim() === '') {
    return 'https://hrudyanshkayastha.github.io'
  }
  const trimmed = raw.trim()
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error(
      `Invalid SITE_URL: "${trimmed}". Must be a valid absolute HTTP or HTTPS URL (e.g. "https://hrudyanshkayastha.github.io" or "https://agletras.pages.dev").`
    )
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `Invalid SITE_URL protocol: "${parsed.protocol}". SITE_URL must use "http:" or "https:".`
    )
  }

  if (!parsed.hostname) {
    throw new Error(`Invalid SITE_URL: "${trimmed}". Missing hostname.`)
  }

  return parsed.origin
}

/**
 * Project base path resolution.
 * Returns '' for root hosting (Cloudflare / custom domain) or '/agletras-intelligence' for GitHub Pages.
 */
export function resolveBasePath(raw?: string): string {
  if (raw !== undefined && raw !== null && raw.trim() !== '') {
    const trimmed = raw.trim()
    if (trimmed === '/' || trimmed === '') return ''
    return trimmed.startsWith('/') ? trimmed.replace(/\/+$/, '') : `/${trimmed.replace(/\/+$/, '')}`
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.BASE_URL === 'string') {
    const vBase = import.meta.env.BASE_URL.replace(/\/+$/, '')
    if (vBase) return vBase.startsWith('/') ? vBase : `/${vBase}`
    return ''
  }
  return '/agletras-intelligence'
}

const nodeEnv =
  typeof globalThis !== 'undefined'
    ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.SITE_URL
    : undefined
const viteEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.SITE_URL as string | undefined)
    : undefined

const nodeBase =
  typeof globalThis !== 'undefined'
    ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.BASE_PATH
    : undefined
const viteBase =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.BASE_PATH as string | undefined)
    : undefined

export const SITE_URL = resolveSiteUrl(nodeEnv || viteEnv)
export const BASE_PATH = resolveBasePath(nodeBase || viteBase)

/** True when a real origin is available, so canonical/sitemap can be emitted. */
export const hasSiteUrl = true

/**
 * Helper to prepend project base path to internal assets, routes, or hash anchors.
 */
export function withBase(path: string): string {
  const base = BASE_PATH // e.g. '/agletras-intelligence' or ''
  if (!base) return path
  if (path === '/') return `${base}/`
  if (path.startsWith('/#')) return `${base}/${path.slice(1)}`
  if (path.startsWith('#')) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

/**
 * Path builders. Returned paths always begin with the configured base path.
 */
export const paths = {
  home: (): string => withBase('/'),
  intelligence: (): string => withBase('/intelligence'),
  about: (): string => withBase('/about'),
  contact: (): string => withBase('/contact'),
  thankYou: (): string => withBase('/contact/thank-you'),
  privacy: (): string => withBase('/privacy'),
  terms: (): string => withBase('/terms'),
  // Legacy / anchor helpers:
  research: (): string => withBase('/intelligence#services'),
  methodology: (): string => withBase('/#workflow'),
  mcp: (): string => withBase('/intelligence#technology'),
  approach: (): string => withBase('/intelligence#capabilities'),
} as const

/**
 * Every canonical page path the site intends to exist, excluding 404.
 */
export function allRoutes(): string[] {
  return [
    paths.home(),
    paths.intelligence(),
    paths.about(),
    paths.contact(),
    paths.privacy(),
    paths.terms(),
  ]
}

/**
 * Normalise a path to this project's canonical form.
 */
export function normalizePath(path: string): string {
  if (typeof path !== 'string' || path.length === 0) return '/'
  const trimmed = path.replace(/\/+$/, '')
  return trimmed.length === 0 ? '/' : trimmed
}

/**
 * Build an absolute URL for a given path.
 */
export function absoluteUrl(path: string): string | null {
  if (!hasSiteUrl || !SITE_URL) return null
  const fullBase = `${SITE_URL}${BASE_PATH}`
  const target = normalizePath(path)
  return target === '/' ? fullBase : `${fullBase}${target}`
}

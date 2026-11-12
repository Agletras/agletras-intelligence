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
 * Defaults to 'https://agletras.com' when genuinely unset.
 */
export function resolveSiteUrl(raw?: string): string {
  if (raw === undefined || raw === null || raw.trim() === '') {
    return 'https://agletras.com'
  }
  const trimmed = raw.trim()
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error(
      `Invalid SITE_URL: "${trimmed}". Must be a valid absolute HTTP or HTTPS URL (e.g. "https://agletras.pages.dev" or "https://agletras.com").`
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

const nodeEnv =
  typeof globalThis !== 'undefined'
    ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.SITE_URL
    : undefined
const viteEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.SITE_URL as string | undefined)
    : undefined

export const SITE_URL = resolveSiteUrl(nodeEnv || viteEnv)

/** True when a real origin is available, so canonical/sitemap can be emitted. */
export const hasSiteUrl = true

/**
 * Path builders. Returned paths always begin with `/` and never end with a
 * trailing slash, which is the site-wide convention.
 */
export const paths = {
  home: (): string => '/',
  intelligence: (): string => '/intelligence',
  about: (): string => '/about',
  contact: (): string => '/contact',
  privacy: (): string => '/privacy',
  terms: (): string => '/terms',
  // Legacy / anchor helpers preserving compatibility without broken links:
  research: (): string => '/intelligence#services',
  methodology: (): string => '/#workflow',
  mcp: (): string => '/intelligence#technology',
  approach: (): string => '/intelligence#capabilities',
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
 * Every path this project produces is trailing-slash free, except root `/`.
 */
export function normalizePath(path: string): string {
  if (typeof path !== 'string' || path.length === 0) return '/'
  const trimmed = path.replace(/\/+$/, '')
  return trimmed.length === 0 ? '/' : trimmed
}

/**
 * Build an absolute URL, or return null when the domain is unknown.
 */
export function absoluteUrl(path: string): string | null {
  if (!hasSiteUrl || !SITE_URL) return null
  return new URL(normalizePath(path), SITE_URL).href
}

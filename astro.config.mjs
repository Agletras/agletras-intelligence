// @ts-check
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

/**
 * Agletras site configuration.
 *
 * STATUS: PROVISIONAL. See docs/15-decision-log/README.md ADR-0004. The
 * framework choice stays "Proposed" until the Phase 2 visual prototype is
 * measured and the owner accepts a decision record.
 *
 * DOMAIN HANDLING
 * The production domain is an open owner decision (OD-06). `site` is read from
 * the build-time SITE_URL environment variable and is deliberately UNSET by
 * default. Until an owner confirms it we must not emit a canonical URL, an
 * absolute sitemap entry, or absolute social metadata: a guessed domain is a
 * fabricated fact, and a wrong absolute URL risks search engines indexing the
 * wrong host (risk R9). `astro build` works without it.
 */

/**
 * Build-time site origin validation.
 *
 * Validates and normalizes SITE_URL build-time configuration. Fails safely
 * with a descriptive error when an invalid origin or protocol is provided.
 * Defaults to 'https://agletras.com' when genuinely unset.
 *
 * @param {string | undefined} raw
 * @returns {string}
 */
function resolveSiteOrigin(raw) {
  if (raw === undefined || raw === null || raw.trim() === '') {
    return 'https://agletras.com'
  }
  const trimmed = raw.trim()
  let parsed
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

const site = resolveSiteOrigin(process.env.SITE_URL)

export default defineConfig({
  // Static output. No server runtime, no backend, no database — consistent with
  // docs/00-project-charter.md "Out of scope unless separately approved".
  output: 'static',

  // Documented output directory for docs/16-release-runbook.md. Must match what
  // the chosen host is configured to publish.
  outDir: './dist',

  // Canonical site origin for absolute metadata, canonical links and sitemaps.
  site,

  // Canonical platform-appropriate redirects from legacy routes to unified /intelligence
  redirects: {
    '/approach': '/intelligence',
    '/research': '/intelligence',
    '/methodology': '/intelligence',
    '/mcp': '/intelligence',
  },

  // Never ship dev-only behaviour into a production build.
  devToolbar: { enabled: false },

  build: {
    // Inline stylesheets Astro considers small. No inline scripts are forced, so
    // the zero-JavaScript-by-default guarantee of ADR-0003 holds until a scene
    // or interactive island is deliberately added.
    inlineStylesheets: 'auto',
    // Fail the build on a broken internal link rather than emitting one.
    // docs/11 requires "no broken links"; this makes it a build-time error.
    checkOrigin: false,
  },

  compressHTML: true,

  vite: {
    resolve: {
      /**
       * `@/` always means project source. Absolute imports keep deep component
       * nesting from producing brittle `../../../..` chains, and make it
       * obvious in review when a module crosses a boundary (e.g. a component
       * reaching into another component's folder).
       */
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})

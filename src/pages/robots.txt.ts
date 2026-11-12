import type { APIRoute } from 'astro'
import { SITE_URL, BASE_PATH } from '@/lib/routes'

export const GET: APIRoute = (context) => {
  const siteOrigin = (context.site ? context.site.origin : SITE_URL).replace(/\/+$/, '')
  const basePath = (BASE_PATH || '').replace(/\/+$/, '')
  const fullSiteUrl = `${siteOrigin}${basePath}`

  const robots = `User-agent: *
Allow: /

Sitemap: ${fullSiteUrl}/sitemap.xml
`
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

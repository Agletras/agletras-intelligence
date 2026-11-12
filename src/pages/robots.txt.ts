import type { APIRoute } from 'astro'
import { SITE_URL } from '@/lib/routes'

export const GET: APIRoute = (context) => {
  const origin = (context.site ? context.site.origin : SITE_URL).replace(/\/+$/, '')
  const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

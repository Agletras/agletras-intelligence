import type { APIRoute } from 'astro'
import { allRoutes, SITE_URL } from '@/lib/routes'

export const GET: APIRoute = (context) => {
  const siteOrigin = (context.site ? context.site.origin : SITE_URL).replace(/\/+$/, '')

  const urls = allRoutes()
    .map((p) => {
      const cleanPath = p === '/' ? '' : (p.endsWith('/') ? p.slice(0, -1) : p)
      return `  <url>
    <loc>${siteOrigin}${cleanPath}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

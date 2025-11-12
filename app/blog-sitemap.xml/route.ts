import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // 1 hour

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts
    .map((post) => {
      const url = `${SITE_CONFIG.url}/blog/${post.slug}`
      const lastmod = post.updatedAt.toISOString()
      const changefreq = 'weekly'
      const priority = '0.8'

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}


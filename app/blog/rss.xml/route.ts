import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // 1 hour

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      publishedAt: true,
      updatedAt: true,
      author: true,
    },
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.name} - Blog</title>
    <link>${SITE_CONFIG.url}/blog</link>
    <description>${SITE_CONFIG.description}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_CONFIG.url}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map((post) => {
        const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`
        const imageUrl = post.coverImage
          ? post.coverImage.startsWith('http')
            ? post.coverImage
            : `${SITE_CONFIG.url}${post.coverImage}`
          : `${SITE_CONFIG.url}/images/imagem-social.png`
        const pubDate = post.publishedAt
          ? new Date(post.publishedAt).toUTCString()
          : new Date().toUTCString()

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
      <enclosure url="${imageUrl}" type="image/jpeg"/>
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}


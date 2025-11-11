import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          'pt-BR': baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: {
        languages: {
          'pt-BR': `${baseUrl}/imoveis`,
          en: `${baseUrl}/en/properties`,
        },
      },
    },
    {
      url: `${baseUrl}/bairros`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Properties
  const properties = await db.property.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const propertySitemaps: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        'pt-BR': `${baseUrl}/imoveis/${property.slug}`,
        en: `${baseUrl}/en/properties/${property.slug}`,
      },
    },
  }))

  // Neighborhoods
  const neighborhoods = await db.neighborhood.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const neighborhoodSitemaps: MetadataRoute.Sitemap = neighborhoods.map(
    (neighborhood) => ({
      url: `${baseUrl}/bairros/${neighborhood.slug}`,
      lastModified: neighborhood.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  )

  return [...staticPages, ...propertySitemaps, ...neighborhoodSitemaps]
}


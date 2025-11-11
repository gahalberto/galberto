import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { db } from '@/lib/db'
import { PropertyCard } from '@/components/property-card'
import { SITE_CONFIG } from '@/lib/constants'
import {
  generateNeighborhoodJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 7200 // 2 hours

interface NeighborhoodPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getNeighborhood(slug: string) {
  const neighborhood = await db.neighborhood.findUnique({
    where: { slug, published: true },
    include: {
      city: {
        include: {
          state: true,
        },
      },
    },
  })

  return neighborhood
}

async function getNeighborhoodProperties(district: string) {
  const properties = await db.property.findMany({
    where: {
      published: true,
      address: {
        district: {
          contains: district,
          mode: 'insensitive',
        },
      },
    },
    include: {
      address: {
        include: {
          neighborhood: {
            include: {
              city: true,
            },
          },
        },
      },
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
    take: 12,
    orderBy: { createdAt: 'desc' },
  })

  return properties
}

export async function generateMetadata({
  params,
}: NeighborhoodPageProps): Promise<Metadata> {
  const { slug } = await params
  const neighborhood = await getNeighborhood(slug)

  if (!neighborhood) {
    return {
      title: 'Bairro não encontrado',
    }
  }

  const title = `${neighborhood.name} - Imóveis e Guia do Bairro`
  const description =
    neighborhood.summary ||
    `Conheça o bairro ${neighborhood.name} em ${neighborhood.city?.name || 'São Paulo'} e encontre imóveis disponíveis.`
  const url = `${SITE_CONFIG.url}/bairros/${neighborhood.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': url,
        en: `${SITE_CONFIG.url}/en/neighborhoods/${neighborhood.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'geo.region': 'BR-SP',
      'geo.placename': `${neighborhood.name}, ${neighborhood.city?.name || 'São Paulo'}`,
      ...(neighborhood.lat &&
        neighborhood.lng && {
          'geo.position': `${neighborhood.lat};${neighborhood.lng}`,
          ICBM: `${neighborhood.lat}, ${neighborhood.lng}`,
        }),
    },
  }
}

export default async function NeighborhoodPage({
  params,
}: NeighborhoodPageProps) {
  const { slug } = await params
  const neighborhood = await getNeighborhood(slug)

  if (!neighborhood) {
    notFound()
  }

  const properties = await getNeighborhoodProperties(neighborhood.name)

  const neighborhoodJsonLd = generateNeighborhoodJsonLd({
    neighborhood: {
      name: neighborhood.name,
      slug: neighborhood.slug,
      city: neighborhood.city?.name || 'São Paulo',
      state: neighborhood.city?.state?.name || 'São Paulo',
      lat: neighborhood.lat,
      lng: neighborhood.lng,
      summary: neighborhood.summary,
    },
  })
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Bairros', url: '/bairros' },
    { name: neighborhood.name, url: `/bairros/${neighborhood.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(neighborhoodJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/bairros" className="hover:text-primary">
            Bairros
          </Link>
          <span>/</span>
          <span className="text-foreground">{neighborhood.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <MapPin className="h-10 w-10 text-primary" />
            {neighborhood.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {neighborhood.city?.name || 'São Paulo'}, {neighborhood.city?.state?.code || 'SP'}
          </p>
          {neighborhood.avgPrice && (
            <p className="text-lg font-semibold text-primary mt-2">
              Preço médio: R${' '}
              {parseFloat(neighborhood.avgPrice.toString()).toLocaleString(
                'pt-BR'
              )}
              /m²
            </p>
          )}
        </div>

        {/* Summary */}
        {neighborhood.summary && (
          <div className="mb-8 p-6 bg-muted/50 rounded-lg">
            <p className="text-lg leading-relaxed">{neighborhood.summary}</p>
          </div>
        )}

        {/* Content */}
        {neighborhood.content && (
          <div className="mb-12 prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: neighborhood.content }} />
          </div>
        )}

        {/* Properties */}
        {properties.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Imóveis em {neighborhood.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    slug: property.slug,
                    title: property.title,
                    price: property.price ? Number(property.price) : null,
                    status: property.status,
                    address: {
                      district: property.address?.neighborhood?.name || property.address?.district || '',
                      city: property.address?.neighborhood?.city?.name || property.address?.city || '',
                    },
                    images: property.images.map((img) => ({
                      url: img.url,
                      alt: img.alt,
                    })),
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    parkingSpots: property.parkingSpots,
                    areaPrivate: property.areaPrivate ? Number(property.areaPrivate) : null,
                    allowAirbnb: property.allowAirbnb,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

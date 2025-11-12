import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Car, Ruler, MapPin, Building } from 'lucide-react'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  formatPrice,
  getPropertyStatusLabel,
  getPropertyPurposeLabel,
} from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import {
  generatePropertyJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo'
import type { Metadata } from 'next'
import { LeadForm } from '@/components/lead-form'
import { PropertyViewTracker } from '@/components/property-view-tracker'

export const revalidate = 3600 // 1 hour

interface PropertyPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProperty(slug: string) {
  const property = await db.property.findUnique({
    where: { slug, published: true },
    include: {
      address: {
        include: {
          neighborhood: {
            include: {
              city: {
                include: {
                  state: true,
                },
              },
            },
          },
        },
      },
      images: {
        orderBy: { position: 'asc' },
      },
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  })

  return property
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) {
    return {
      title: 'Imóvel não encontrado',
    }
  }

  const title = `${property.title} - ${property.address?.neighborhood?.name || property.address?.district || 'São Paulo'}`
  const description = property.description.slice(0, 160)
  const url = `${SITE_CONFIG.url}/imoveis/${property.slug}`
  const defaultImage = {
    url: `${SITE_CONFIG.url}/images/imagem-social.png`,
    width: 1200,
    height: 630,
    alt: property.title,
  }
  const images = property.images.length > 0
    ? property.images.map((img) => ({
        url: img.url,
        width: img.width || 1200,
        height: img.height || 630,
        alt: img.alt || property.title,
      }))
    : [defaultImage]

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': url,
        en: `${SITE_CONFIG.url}/en/properties/${property.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((img) => img.url),
    },
    other: {
      'geo.region': 'BR-SP',
      'geo.placename': `${property.address?.neighborhood?.name || property.address?.district || 'São Paulo'}, ${property.address?.neighborhood?.city?.name || property.address?.city || 'São Paulo'}`,
      ...(property.lat &&
        property.lng && {
          'geo.position': `${property.lat};${property.lng}`,
          ICBM: `${property.lat}, ${property.lng}`,
          'place:location:latitude': property.lat.toString(),
          'place:location:longitude': property.lng.toString(),
        }),
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) {
    notFound()
  }

  const propertyJsonLd = generatePropertyJsonLd({
    property: {
      title: property.title,
      description: property.description,
      slug: property.slug,
      price: property.price ? Number(property.price) : null,
      purpose: property.purpose,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      areaPrivate: property.areaPrivate ? Number(property.areaPrivate) : null,
      areaTotal: property.areaTotal ? Number(property.areaTotal) : null,
      lat: property.lat ? Number(property.lat) : null,
      lng: property.lng ? Number(property.lng) : null,
      address: {
        street: property.address?.street || '',
        number: property.address?.streetNumber || null,
        district: property.address?.neighborhood?.name || property.address?.district || '',
        city: property.address?.neighborhood?.city?.name || property.address?.city || '',
        state: property.address?.neighborhood?.city?.state?.code || property.address?.state || '',
        zipcode: property.address?.postalCode || property.address?.zipcode || '',
        country: property.address?.country || 'BR',
      },
      images: property.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
      amenities: property.amenities.map((pa) => ({
        amenity: {
          name: pa.amenity.name,
        },
      })),
    },
  })
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Imóveis', url: '/imoveis' },
    { name: property.title, url: `/imoveis/${property.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PropertyViewTracker slug={property.slug} title={property.title} />

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/imoveis" className="hover:text-primary">
            Imóveis
          </Link>
          <span>/</span>
          <span className="text-foreground">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-4">
              {property.images.length > 0 ? (
                <>
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                    <Image
                      src={property.images[0].url}
                      alt={property.images[0].alt || property.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {property.images.slice(1, 5).map((image) => (
                        <div
                          key={image.id}
                          className="relative aspect-square rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image.url}
                            alt={image.alt || property.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 25vw, 16vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[16/10] rounded-lg bg-muted flex items-center justify-center">
                  <Building className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{getPropertyStatusLabel(property.status)}</Badge>
                <Badge variant="outline">
                  {getPropertyPurposeLabel(property.purpose)}
                </Badge>
                {property.allowAirbnb && (
                  <Badge variant="success">Permite Airbnb</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {property.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {property.address?.street || ''}
                {property.address?.streetNumber && `, ${property.address.streetNumber}`} -{' '}
                {property.address?.neighborhood?.name || property.address?.district || ''}, {property.address?.neighborhood?.city?.name || property.address?.city || ''} -{' '}
                {property.address?.neighborhood?.city?.state?.code || property.address?.state || ''}
              </p>
              <div className="mt-4">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {formatPrice(property.price ? Number(property.price) : null)}
                </div>
                {(property.condoFee || property.iptuYearly) && (
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    {property.condoFee && (
                      <span>Condomínio: {formatPrice(Number(property.condoFee))}</span>
                    )}
                    {property.iptuYearly && (
                      <span>
                        IPTU: {formatPrice(Number(property.iptuYearly))}/ano
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {property.bedrooms && (
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Bed className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">{property.bedrooms}</span>
                  <span className="text-sm text-muted-foreground">
                    {property.bedrooms === 1 ? 'Quarto' : 'Quartos'}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Bath className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">
                    {property.bathrooms}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {property.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}
                  </span>
                </div>
              )}
              {property.parkingSpots && (
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Car className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">
                    {property.parkingSpots}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {property.parkingSpots === 1 ? 'Vaga' : 'Vagas'}
                  </span>
                </div>
              )}
              {property.areaPrivate && (
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Ruler className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">
                    {Number(property.areaPrivate)}
                  </span>
                  <span className="text-sm text-muted-foreground">m²</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Highlights */}
            {property.highlights.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-bold mb-4">Destaques</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-bold mb-4">Comodidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((pa) => (
                      <div
                        key={pa.amenityId}
                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="text-primary">✓</span>
                        <span className="text-sm">{pa.amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Info */}
            <Separator />
            <div>
              <h2 className="text-2xl font-bold mb-4">Informações Adicionais</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.yearBuilt && (
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Ano de Construção
                    </dt>
                    <dd className="font-medium">{property.yearBuilt}</dd>
                  </div>
                )}
                {property.deliveryDate && (
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Previsão de Entrega
                    </dt>
                    <dd className="font-medium">
                      {new Date(property.deliveryDate).toLocaleDateString(
                        'pt-BR'
                      )}
                    </dd>
                  </div>
                )}
                {property.floor && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Andar</dt>
                    <dd className="font-medium">{property.floor}º</dd>
                  </div>
                )}
                {property.developer && (
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Construtora
                    </dt>
                    <dd className="font-medium">{property.developer}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

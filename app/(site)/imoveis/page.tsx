import { PropertyCard } from '@/components/property-card'
import { db } from '@/lib/db'
import type { Metadata } from 'next'

export const revalidate = 1800 // 30 minutes

export const metadata: Metadata = {
  title: 'Imóveis em São Paulo',
  description:
    'Confira nossa seleção completa de imóveis em São Paulo. Apartamentos, casas, lançamentos e muito mais.',
}

interface SearchParams {
  status?: string
  purpose?: string
  bedrooms?: string
  allowAirbnb?: string
  district?: string
  neighborhood?: string
  region?: string
  street?: string
  search?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

async function getProperties(searchParams: SearchParams) {
  const where: any = {
    published: true,
  }

  if (searchParams.status) {
    where.status = searchParams.status
  }

  if (searchParams.purpose) {
    where.purpose = searchParams.purpose
  }

  if (searchParams.bedrooms) {
    where.bedrooms = { gte: parseInt(searchParams.bedrooms) }
  }

  if (searchParams.allowAirbnb === 'true') {
    where.allowAirbnb = true
  }

  // Buscar por bairro, região, rua ou texto livre
  const addressConditions: any[] = []
  
  if (searchParams.neighborhood) {
    addressConditions.push({
      neighborhood: {
        name: {
          contains: searchParams.neighborhood,
          mode: 'insensitive',
        },
      },
    })
  }
  
  if (searchParams.region) {
    addressConditions.push({
      neighborhood: {
        region: {
          name: {
            contains: searchParams.region,
            mode: 'insensitive',
          },
        },
      },
    })
  }
  
  if (searchParams.street) {
    addressConditions.push({
      street: {
        contains: searchParams.street,
        mode: 'insensitive',
      },
    })
  }
  
  if (searchParams.district) {
    addressConditions.push({
      district: {
        contains: searchParams.district,
        mode: 'insensitive',
      },
    })
  }
  
  if (searchParams.search) {
    addressConditions.push({
      OR: [
        { street: { contains: searchParams.search, mode: 'insensitive' } },
        { district: { contains: searchParams.search, mode: 'insensitive' } },
      ],
    })
  }
  
  if (addressConditions.length > 0) {
    where.address = {
      OR: addressConditions,
    }
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) {
      where.price.gte = parseFloat(searchParams.minPrice)
    }
    if (searchParams.maxPrice) {
      where.price.lte = parseFloat(searchParams.maxPrice)
    }
  }

  let orderBy: any = { createdAt: 'desc' }

  if (searchParams.sort === 'price-asc') {
    orderBy = { price: 'asc' }
  } else if (searchParams.sort === 'price-desc') {
    orderBy = { price: 'desc' }
  } else if (searchParams.sort === 'area-desc') {
    orderBy = { areaPrivate: 'desc' }
  }

  const properties = await db.property.findMany({
    where,
    include: {
      address: {
        include: {
          neighborhood: {
            include: {
              city: true,
              region: true,
            },
          },
        },
      },
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
    orderBy,
    take: 50,
  })

  return properties
}

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const properties = await getProperties(resolvedSearchParams)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Nossos Imóveis</h1>
        <p className="text-muted-foreground text-lg">
          Encontre o imóvel ideal para você em São Paulo
        </p>
      </div>

      {/* TODO: Add filters component */}

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {properties.length} {properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </p>
      </div>

      {properties.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Nenhum imóvel encontrado com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  )
}

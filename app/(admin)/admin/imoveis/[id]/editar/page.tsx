import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PropertyForm } from '@/components/admin/property-form'

async function getProperty(id: string) {
  const property = await db.property.findUnique({
    where: { id },
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
              region: true,
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

  if (!property) {
    return null
  }

  // Convert Decimal fields to numbers for Client Components
  return {
    ...property,
    price: property.price ? Number(property.price) : null,
    condoFee: property.condoFee ? Number(property.condoFee) : null,
    iptuYearly: property.iptuYearly ? Number(property.iptuYearly) : null,
    areaTotal: property.areaTotal ? Number(property.areaTotal) : null,
    areaPrivate: property.areaPrivate ? Number(property.areaPrivate) : null,
    lat: property.lat ? Number(property.lat) : null,
    lng: property.lng ? Number(property.lng) : null,
    amenities: property.amenities.map((pa) => ({
      amenityId: pa.amenityId,
      amenity: pa.amenity,
    })),
  }
}

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const amenities = await db.amenity.findMany({
    orderBy: { name: 'asc' },
  })

  // Transform amenities to match form expectations (convert null to undefined)
  const transformedAmenities = amenities.map((amenity) => ({
    id: amenity.id,
    name: amenity.name,
    icon: amenity.icon ?? undefined,
    category: amenity.category ?? undefined,
  }))

  // Transform property to match form expectations
  const propertyData = {
    ...property,
    amenities: property.amenities.map((pa: any) => pa.amenityId),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Editar Imóvel</h1>
        <p className="text-muted-foreground">
          {property.title}
        </p>
      </div>

      <PropertyForm property={propertyData} amenities={transformedAmenities} />
    </div>
  )
}


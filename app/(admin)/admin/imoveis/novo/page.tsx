import { db } from '@/lib/db'
import { PropertyForm } from '@/components/admin/property-form'

export default async function NovoImovelPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Novo Imóvel</h1>
        <p className="text-muted-foreground">
          Cadastre um novo imóvel no sistema
        </p>
      </div>

      <PropertyForm amenities={transformedAmenities} />
    </div>
  )
}


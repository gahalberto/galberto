import Link from 'next/link'
import { Plus, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/lib/db'
import { formatPrice, getPropertyStatusLabel } from '@/lib/utils'

async function getProperties() {
  // Buscar todos os IDs de endereços válidos
  const validAddressIds = await db.address.findMany({
    select: { id: true },
  })
  const validAddressIdSet = new Set(validAddressIds.map((a) => a.id))

  // Buscar propriedades que têm addressId válido
  const allProperties = await db.property.findMany({
    where: {
      addressId: {
        not: null,
      },
    },
    include: {
      images: {
        take: 1,
        orderBy: { position: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Filtrar apenas propriedades com addressId válido
  const propertiesWithValidAddress = allProperties.filter(
    (p) => p.addressId && validAddressIdSet.has(p.addressId)
  )

  // Buscar endereços para as propriedades válidas
  const addressIds = propertiesWithValidAddress
    .map((p) => p.addressId)
    .filter((id): id is number => id !== null)

  const addresses = await db.address.findMany({
    where: {
      id: {
        in: addressIds,
      },
    },
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
  })

  const addressMap = new Map(addresses.map((a) => [a.id, a]))

  // Combinar propriedades com seus endereços
  const properties = propertiesWithValidAddress.map((property) => ({
    ...property,
    address: property.addressId ? addressMap.get(property.addressId) : null,
  }))

  return properties
}

export default async function AdminImoveisPage() {
  const properties = await getProperties()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Imóveis</h1>
          <p className="text-muted-foreground">
            Gerencie todos os imóveis cadastrados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/imoveis/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Link>
        </Button>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <Link key={property.id} href={`/admin/imoveis/${property.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{property.title}</CardTitle>
                      <CardDescription>
                        {property.address?.neighborhood?.name || property.address?.district || 'Sem endereço'}, {property.address?.neighborhood?.city?.name || property.address?.city || ''}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={property.published ? 'success' : 'secondary'}
                      >
                        {property.published ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      <Badge variant="outline">
                        {getPropertyStatusLabel(property.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(property.price ? Number(property.price) : null)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {property.bedrooms && `${property.bedrooms} quartos`}
                      {property.bedrooms && property.areaPrivate && ' • '}
                      {property.areaPrivate && `${Number(property.areaPrivate)}m²`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum imóvel cadastrado ainda
            </p>
            <Button asChild>
              <Link href="/admin/imoveis/novo">
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar primeiro imóvel
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


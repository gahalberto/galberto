import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Eye, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { formatPrice, formatArea, getPropertyStatusLabel, getPropertyPurposeLabel } from '@/lib/utils'

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

  return property
}

export default async function VerImovelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/imoveis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
            <p className="text-muted-foreground">
{property.address?.neighborhood?.name || property.address?.district || 'Sem bairro'}, {property.address?.neighborhood?.city?.name || property.address?.city || 'Sem cidade'} - {property.address?.neighborhood?.city?.state?.code || property.address?.state || 'Sem estado'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/imoveis/${property.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Ver no Site
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/imoveis/${property.id}/editar`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Imagens */}
          {property.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Imagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={image.alt || property.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{property.description}</p>
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms && (
                  <div>
                    <p className="text-sm text-muted-foreground">Quartos</p>
                    <p className="text-lg font-semibold">{property.bedrooms}</p>
                  </div>
                )}
                {property.suites && (
                  <div>
                    <p className="text-sm text-muted-foreground">Suítes</p>
                    <p className="text-lg font-semibold">{property.suites}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <p className="text-sm text-muted-foreground">Banheiros</p>
                    <p className="text-lg font-semibold">{property.bathrooms}</p>
                  </div>
                )}
                {property.parkingSpots && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vagas</p>
                    <p className="text-lg font-semibold">{property.parkingSpots}</p>
                  </div>
                )}
                {property.areaTotal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Área Total</p>
                    <p className="text-lg font-semibold">{formatArea(Number(property.areaTotal))}</p>
                  </div>
                )}
                {property.areaPrivate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Área Privativa</p>
                    <p className="text-lg font-semibold">{formatArea(Number(property.areaPrivate))}</p>
                  </div>
                )}
                {property.floor && (
                  <div>
                    <p className="text-sm text-muted-foreground">Andar</p>
                    <p className="text-lg font-semibold">{property.floor}</p>
                  </div>
                )}
                {property.yearBuilt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ano</p>
                    <p className="text-lg font-semibold">{property.yearBuilt}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenidades */}
          {property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((pa) => (
                    <Badge key={pa.amenityId} variant="outline">
                      {pa.amenity.icon && <span className="mr-1">{pa.amenity.icon}</span>}
                      {pa.amenity.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline">{getPropertyStatusLabel(property.status)}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Finalidade</p>
                <Badge variant="outline">{getPropertyPurposeLabel(property.purpose)}</Badge>
              </div>
              {property.price && (
                <div>
                  <p className="text-sm text-muted-foreground">Preço</p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(Number(property.price))}</p>
                </div>
              )}
              {property.condoFee && (
                <div>
                  <p className="text-sm text-muted-foreground">Condomínio</p>
                  <p className="text-lg font-semibold">{formatPrice(Number(property.condoFee))}</p>
                </div>
              )}
              {property.iptuYearly && (
                <div>
                  <p className="text-sm text-muted-foreground">IPTU Anual</p>
                  <p className="text-lg font-semibold">{formatPrice(Number(property.iptuYearly))}</p>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={property.published}
                    disabled
                    className="rounded"
                  />
                  <span className="text-sm">Publicado</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={property.featured}
                    disabled
                    className="rounded"
                  />
                  <span className="text-sm">Destaque</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={property.allowAirbnb}
                    disabled
                    className="rounded"
                  />
                  <span className="text-sm">Permite Airbnb</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                {property.address?.street || ''}
                {property.address?.streetNumber && `, ${property.address.streetNumber}`}
                {property.address?.complement && ` - ${property.address.complement}`}
              </p>
              <p>
  {property.address?.neighborhood?.name || property.address?.district || 'Sem bairro'}, {property.address?.neighborhood?.city?.name || property.address?.city || 'Sem cidade'} - {property.address?.neighborhood?.city?.state?.code || property.address?.state || 'Sem estado'}
              </p>
              <p>CEP: {property.address?.postalCode || property.address?.zipcode || 'N/A'}</p>
              {property.lat && property.lng && (
                <p className="text-sm text-muted-foreground">
                  Coordenadas: {property.lat.toFixed(6)}, {property.lng.toFixed(6)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          {(property.canonicalUrl || property.ogImage) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.canonicalUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground">URL Canônica</p>
                    <p className="text-sm break-all">{property.canonicalUrl}</p>
                  </div>
                )}
                {property.ogImage && (
                  <div>
                    <p className="text-sm text-muted-foreground">OG Image</p>
                    <img
                      src={property.ogImage}
                      alt="OG Image"
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}


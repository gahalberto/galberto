import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Car, Ruler, MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatArea, getPropertyStatusLabel } from '@/lib/utils'

interface PropertyCardProps {
  property: {
    slug: string
    title: string
    price: number | string | null
    status: string
    address: {
      district: string
      city: string
    }
    images: { url: string; alt?: string | null }[]
    bedrooms?: number | null
    bathrooms?: number | null
    parkingSpots?: number | null
    areaPrivate?: number | string | null
    allowAirbnb: boolean
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0]

  return (
    <Link href={`/imoveis/${property.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || property.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="shadow-md">
              {getPropertyStatusLabel(property.status)}
            </Badge>
            {property.allowAirbnb && (
              <Badge variant="success" className="shadow-md">
                Airbnb OK
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {property.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.address.district}, {property.address.city}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.parkingSpots && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                <span>{property.parkingSpots}</span>
              </div>
            )}
            {property.areaPrivate && (
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{formatArea(property.areaPrivate)}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <span className="text-sm text-primary font-medium hover:underline">
            Ver detalhes →
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

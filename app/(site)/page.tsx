import Link from 'next/link'
import { TrendingUp, Home, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property-card'
import { HeroSearch } from '@/components/hero-search'
import { db } from '@/lib/db'

export const revalidate = 600 // 10 minutes

async function getFeaturedProperties() {
  const properties = await db.property.findMany({
    where: {
      published: true,
      featured: true,
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
    take: 6,
    orderBy: { createdAt: 'desc' },
  })

  return properties
}

async function getNewProperties() {
  const properties = await db.property.findMany({
    where: {
      published: true,
      status: 'LANCAMENTO',
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
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return properties
}

async function getReadyProperties() {
  const properties = await db.property.findMany({
    where: {
      published: true,
      status: 'PRONTO',
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
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return properties
}

async function getAirbnbProperties() {
  const properties = await db.property.findMany({
    where: {
      published: true,
      allowAirbnb: true,
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
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return properties
}

export default async function HomePage() {
  const [featured, launches, ready, airbnb] = await Promise.all([
    getFeaturedProperties(),
    getNewProperties(),
    getReadyProperties(),
    getAirbnbProperties(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative text-white min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: 'url(/images/banners/banner-principal2.png)',
        }}
      >
        {/* Overlay escuro para melhorar legibilidade do texto */}
        <div className="absolute inset-0 "></div>
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              Encontre o imóvel perfeito em São Paulo
            </h1>
            <p className="text-xl text-white/90">
              Lançamentos exclusivos, apartamentos prontos e as melhores
              oportunidades para investimento
            </p>
            
            {/* Busca */}
            <HeroSearch />
            
            <div className="flex flex-col md:flex-row gap-4 pt-6 items-center md:items-start">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 w-full md:w-auto"
                asChild
              >
                <Link href="/imoveis?allowAirbnb=true">Quero para Investimento</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-primary-foreground hover:text-primary hover:border-primary-foreground w-full md:w-auto"
                asChild
              >
                <Link href="/imoveis?status=PRONTO">Meu Primeiro Imóvel</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <Sparkles className="h-8 w-8 text-primary" />
                  Destaques
                </h2>
                <p className="text-muted-foreground mt-2">
                  Imóveis selecionados especialmente para você
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/imoveis">Ver todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property) => (
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
        </section>
      )}

      {/* Lançamentos */}
      {launches.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Lançamentos
                </h2>
                <p className="text-muted-foreground mt-2">
                  Os mais recentes empreendimentos do mercado
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/imoveis?status=LANCAMENTO">Ver todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {launches.map((property) => (
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
        </section>
      )}

      {/* Prontos para Morar */}
      {ready.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <Home className="h-8 w-8 text-primary" />
                  Prontos para Morar
                </h2>
                <p className="text-muted-foreground mt-2">
                  Receba as chaves e mude-se hoje mesmo
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/imoveis?status=PRONTO">Ver todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ready.map((property) => (
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
        </section>
      )}

      {/* Airbnb Properties */}
      {airbnb.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">
                  Ideais para Airbnb
                </h2>
                <p className="text-muted-foreground mt-2">
                  Imóveis com alto potencial de rentabilidade
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/imoveis?allowAirbnb=true">Ver todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {airbnb.map((property) => (
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
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para encontrar seu próximo imóvel?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Entre em contato conosco e descubra as melhores oportunidades do
            mercado imobiliário
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contato">Fale conosco</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

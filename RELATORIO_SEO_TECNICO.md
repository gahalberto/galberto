# 📊 Relatório de SEO Técnico, Programático, GEO e para IAs
## Gabriel Alberto Imóveis - Análise Completa

**Data:** Novembro 2024  
**Versão do Projeto:** Next.js 15, Prisma ORM, PostgreSQL  
**Objetivo:** Avaliar e otimizar para SEO tradicional, programático, GEO e consultas de IA

---

## 1. 📋 DIAGNÓSTICO TÉCNICO ATUAL

### 1.1 Estrutura de Dados (Prisma Schema)

#### ✅ Pontos Fortes

1. **Hierarquia de Localização Completa**
   - `State` → `City` → `Neighborhood` → `Address` → `Property`
   - Relações bem definidas com `onDelete: Cascade`
   - Suporte a `Region` (Zona Sul, Zona Norte, etc.)

2. **Campos GEO Implementados**
   - `lat`/`lng` em `Address` e `Neighborhood`
   - Índice composto `idx_address_lat_lng` para consultas espaciais
   - Suporte para PostGIS (comentado, mas preparado)

3. **Campos SEO Básicos**
   - `slug` único em `Property` e `Neighborhood`
   - `canonicalUrl` em `Property`
   - `ogImage` em `Property`
   - `summary` e `content` (markdown) em `Neighborhood`

4. **Dados Comerciais Ricos**
   - Preço, área, quartos, banheiros, vagas
   - Status (LANCAMENTO, EM_OBRAS, PRONTO)
   - Purpose (VENDA, ALUGUEL)
   - Amenities relacionadas

#### ⚠️ Pontos de Atenção

1. **Campos Legacy Duplicados**
   - `Property.lat/lng` vs `Address.lat/lng` (deprecated mas ainda usado)
   - `Address.district/city/state` vs `Neighborhood.city.state` (redundância)

2. **Falta de Campos para SEO Programático**
   - Sem `metaTitle` customizado por página
   - Sem `metaDescription` customizado
   - Sem `keywords` estruturados
   - Sem `faq` (JSON) para FAQs

3. **Falta de Dados para IAs**
   - Sem campo `faq` (array de perguntas/respostas)
   - Sem `relatedProperties` (relacionamento sugerido)
   - Sem `investmentScore` ou métricas de investimento

### 1.2 Implementação de Metadados

#### ✅ Implementado

1. **Next.js Metadata API**
   - `generateMetadata` em páginas dinâmicas
   - Title, description, canonical
   - Open Graph completo
   - Twitter Cards
   - Geo tags (geo.region, geo.position, ICBM)

2. **JSON-LD (Schema.org)**
   - `WebSite` com SearchAction
   - `RealEstateAgent` (Organization)
   - `Residence` para imóveis
   - `Place` para bairros
   - `BreadcrumbList` em páginas hierárquicas

3. **Sitemap e Robots**
   - `sitemap.xml` dinâmico com lastModified
   - `geo-sitemap.kml` para Google Maps
   - `robots.txt` configurado

#### ⚠️ Melhorias Necessárias

1. **Schema.org Incompleto**
   - Falta `Offer` completo (priceValidUntil, availability)
   - Falta `LocalBusiness` para páginas institucionais
   - Falta `FAQPage` para FAQs
   - Falta `ItemList` para listagens de imóveis

2. **Geo Metadata**
   - Geo tags presentes, mas podem ser mais completos
   - Falta `geo.radius` para áreas de cobertura
   - Falta `place:location` mais estruturado

3. **Alternates/Hreflang**
   - Configurado para pt-BR/en, mas páginas EN não existem
   - Pode gerar confusão para crawlers

### 1.3 Performance e Core Web Vitals

#### ✅ Implementado

1. **Next.js 15 Otimizações**
   - App Router com Server Components
   - `revalidate` configurado (3600s para imóveis, 7200s para bairros)
   - Image optimization com Next/Image
   - AVIF e WebP suportados

2. **Headers de Segurança**
   - X-Frame-Options, X-Content-Type-Options
   - Referrer-Policy
   - DNS Prefetch

#### ⚠️ Melhorias Necessárias

1. **Falta de Métricas de Performance**
   - Sem `@vercel/speed-insights`
   - Sem monitoramento de Core Web Vitals
   - Sem lazy loading de componentes pesados

2. **Otimização de Imagens**
   - Imagens podem ter `priority` apenas na primeira
   - Falta `loading="lazy"` explícito
   - Falta `placeholder="blur"` para melhor UX

3. **Bundle Size**
   - Não verificado tamanho de bundles
   - Pode ter dependências desnecessárias

### 1.4 Acessibilidade

#### ⚠️ Pontos de Atenção

1. **Sem Validação de Acessibilidade**
   - Não há testes de acessibilidade
   - Falta `aria-label` em alguns elementos
   - Falta `alt` text em todas as imagens (algumas têm)

2. **Semântica HTML**
   - Uso de `<nav>` para breadcrumbs ✅
   - Falta `<main>` explícito em algumas páginas
   - Falta `<article>` para conteúdo de imóveis

---

## 2. 🚨 PONTOS FRACOS E RISCOS

### 2.1 Riscos Críticos

1. **Páginas Faltantes**
   - ❌ `/regiao/[slug]` - não implementada
   - ❌ `/investir/[bairro]` - não implementada
   - ❌ `/minha-casa-minha-vida` - não implementada
   - ⚠️ Páginas EN mencionadas mas não existem

2. **Schema.org Incompleto**
   - `Residence` não usa `@type` mais específico (Apartment, SingleFamilyResidence)
   - `Offer` não tem `priceValidUntil` para aluguel
   - Falta `aggregateRating` para reviews futuros

3. **Geo Sitemap KML**
   - Usa `Property.lat/lng` (deprecated) ao invés de `Address.lat/lng`
   - Não inclui bairros no KML
   - Formato pode ser melhorado

4. **Falta de Conteúdo para IAs**
   - Sem FAQs estruturados
   - Sem conteúdo semântico rico (listas, tabelas, definições)
   - Sem relacionamento explícito entre localização e tipo de imóvel

### 2.2 Riscos Moderados

1. **SEO Programático Limitado**
   - Páginas de bairro não geram conteúdo dinâmico suficiente
   - Falta de estatísticas locais (preço médio, tendências)
   - Falta de conteúdo gerado automaticamente

2. **Performance**
   - Queries podem ser otimizadas (N+1 queries potenciais)
   - Falta de cache em nível de aplicação
   - Sitemap pode ficar lento com muitos imóveis

3. **Indexabilidade**
   - Falta de `hreflang` correto (páginas EN não existem)
   - Canonical pode ter problemas em filtros de busca
   - Falta de `noindex` em páginas de busca com filtros vazios

---

## 3. 💡 RECOMENDAÇÕES PRÁTICAS

### 3.1 Melhorias no Schema Prisma

#### Adicionar Campos para SEO e IAs

```prisma
model Property {
  // ... campos existentes ...
  
  // SEO customizado
  metaTitle       String?  @db.Text
  metaDescription String?  @db.Text
  keywords        String[] // Array de keywords
  
  // Para IAs
  faq             Json?    // Array de {question, answer}
  investmentScore Float?   // Score de 0-100 para investimento
  
  // Relacionamentos sugeridos
  relatedProperties Property[] @relation("RelatedProperties")
  relatedPropertyIds String[]
}

model Neighborhood {
  // ... campos existentes ...
  
  // SEO
  metaTitle       String?  @db.Text
  metaDescription String?  @db.Text
  
  // Para IAs
  faq             Json?    // FAQs sobre o bairro
  stats           Json?    // Estatísticas (preço médio, crescimento, etc.)
  
  // Conteúdo rico
  highlights      String[] // Destaques do bairro
  nearbyPlaces    Json?    // Lugares próximos (shopping, escolas, etc.)
}

model Region {
  // ... campos existentes ...
  
  slug        String   @unique
  description String?  @db.Text
  image       String?
  metaTitle   String?  @db.Text
  metaDescription String? @db.Text
}
```

### 3.2 Schema.org Completo para Imóveis

#### Atualizar `lib/seo.ts`

```typescript
export function generatePropertyJsonLd({
  property,
}: PropertyJsonLdProps): JsonLdBase & Record<string, any> {
  const propertyUrl = `${SITE_CONFIG.url}/imoveis/${property.slug}`
  
  // Determinar tipo específico de imóvel
  const propertyType = property.bedrooms && property.bedrooms <= 2
    ? 'Apartment'
    : property.bedrooms && property.bedrooms >= 4
    ? 'SingleFamilyResidence'
    : 'Residence'

  return {
    '@context': 'https://schema.org',
    '@type': propertyType,
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: property.images.map((img) => img.url),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${property.address.street}${property.address.number ? ', ' + property.address.number : ''}`,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.zipcode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.lat || property.address?.lat,
      longitude: property.lng || property.address?.lng,
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.areaPrivate || property.areaTotal,
      unitCode: 'MTK',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    parkingFeature: property.parkingSpots ? [{
      '@type': 'ParkingFacility',
      numberOfSpaces: property.parkingSpots,
    }] : undefined,
    amenityFeature: property.amenities?.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a.amenity.name,
      value: true,
    })),
    offers: {
      '@type': 'Offer',
      price: property.price || 0,
      priceCurrency: 'BRL',
      availability: property.status === 'PRONTO' 
        ? 'https://schema.org/InStock'
        : property.status === 'EM_OBRAS'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/PreSale',
      priceValidUntil: property.purpose === 'VENDA'
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 dias
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias para aluguel
      url: propertyUrl,
      seller: {
        '@type': 'RealEstateAgent',
        name: property.realtorName || SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
    },
    // Adicionar FAQ se existir
    ...(property.faq && {
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: property.faq.map((item: {question: string, answer: string}) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    }),
  }
}
```

### 3.3 Schema.org para Páginas de Bairro

```typescript
export function generateNeighborhoodJsonLd({
  neighborhood,
}: NeighborhoodJsonLdProps): JsonLdBase & Record<string, any> {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: neighborhood.name,
    description: neighborhood.summary,
    url: `${SITE_CONFIG.url}/bairros/${neighborhood.slug}`,
    geo: neighborhood.lat && neighborhood.lng ? {
      '@type': 'GeoCoordinates',
      latitude: neighborhood.lat,
      longitude: neighborhood.lng,
    } : undefined,
    containedInPlace: {
      '@type': 'City',
      name: neighborhood.city,
      containedInPlace: {
        '@type': 'State',
        name: neighborhood.state,
      },
    },
  }

  // Adicionar FAQ se existir
  if (neighborhood.faq) {
    return {
      ...baseSchema,
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: neighborhood.faq.map((item: {question: string, answer: string}) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    }
  }

  return baseSchema
}
```

### 3.4 Implementar Página de Região

#### Criar `app/(site)/regiao/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PropertyCard } from '@/components/property-card'
import { SITE_CONFIG } from '@/lib/constants'
import { generateBreadcrumbJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 7200 // 2 hours

interface RegionPageProps {
  params: Promise<{ slug: string }>
}

async function getRegion(slug: string) {
  const region = await db.region.findFirst({
    where: { slug, isActive: true },
    include: {
      neighborhoods: {
        where: { published: true },
        include: {
          city: {
            include: { state: true },
          },
        },
      },
    },
  })
  return region
}

async function getRegionProperties(regionId: number) {
  const properties = await db.property.findMany({
    where: {
      published: true,
      address: {
        neighborhood: {
          regionId,
        },
      },
    },
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
    take: 24,
    orderBy: { createdAt: 'desc' },
  })
  return properties
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { slug } = await params
  const region = await getRegion(slug)

  if (!region) {
    return { title: 'Região não encontrada' }
  }

  const title = `Imóveis na ${region.name} - São Paulo`
  const description =
    region.description ||
    `Encontre os melhores imóveis na região ${region.name} em São Paulo. Apartamentos, casas e lançamentos.`
  const url = `${SITE_CONFIG.url}/regiao/${region.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: region.image
        ? [{ url: region.image, width: 1200, height: 630, alt: title }]
        : [{ url: `${SITE_CONFIG.url}/images/imagem-social.png` }],
    },
    other: {
      'geo.region': 'BR-SP',
      'geo.placename': `${region.name}, São Paulo`,
    },
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params
  const region = await getRegion(slug)

  if (!region) {
    notFound()
  }

  const properties = await getRegionProperties(region.id)

  // Schema.org para região
  const regionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: region.name,
    description: region.description,
    url: `${SITE_CONFIG.url}/regiao/${region.slug}`,
    containedInPlace: {
      '@type': 'City',
      name: 'São Paulo',
      containedInPlace: {
        '@type': 'State',
        name: 'São Paulo',
      },
    },
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Regiões', url: '/regiao' },
    { name: region.name, url: `/regiao/${region.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(regionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/regiao">Regiões</Link>
          <span>/</span>
          <span className="text-foreground">{region.name}</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">{region.name}</h1>
        {region.description && (
          <p className="text-lg text-muted-foreground mb-8">
            {region.description}
          </p>
        )}

        {/* Bairros da região */}
        {region.neighborhoods.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Bairros na {region.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {region.neighborhoods.map((neighborhood) => (
                <Link
                  key={neighborhood.id}
                  href={`/bairros/${neighborhood.slug}`}
                  className="p-4 border rounded-lg hover:bg-muted transition"
                >
                  <h3 className="font-semibold">{neighborhood.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {neighborhood.city.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Imóveis da região */}
        {properties.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Imóveis na {region.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={...} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
```

### 3.5 Implementar Página de Investimento por Bairro

#### Criar `app/(site)/investir/[bairro]/page.tsx`

```typescript
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PropertyCard } from '@/components/property-card'
import { SITE_CONFIG } from '@/lib/constants'
import { generateBreadcrumbJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'
import { TrendingUp, DollarSign, MapPin } from 'lucide-react'

export const revalidate = 7200

interface InvestmentPageProps {
  params: Promise<{ bairro: string }>
}

async function getNeighborhood(slug: string) {
  return await db.neighborhood.findUnique({
    where: { slug, published: true },
    include: {
      city: { include: { state: true } },
      addresses: {
        include: {
          property: {
            where: { published: true, allowAirbnb: true },
            include: {
              images: { orderBy: { position: 'asc' }, take: 1 },
            },
          },
        },
      },
    },
  })
}

async function calculateInvestmentStats(neighborhood: any) {
  const properties = neighborhood.addresses
    .map((addr: any) => addr.property)
    .filter((p: any) => p && p.price && p.areaPrivate)

  if (properties.length === 0) return null

  const avgPricePerM2 = properties.reduce((sum: number, p: any) => {
    return sum + Number(p.price) / Number(p.areaPrivate)
  }, 0) / properties.length

  const avgPrice = properties.reduce((sum: number, p: any) => {
    return sum + Number(p.price)
  }, 0) / properties.length

  return {
    avgPricePerM2: Math.round(avgPricePerM2),
    avgPrice: Math.round(avgPrice),
    totalProperties: properties.length,
  }
}

export async function generateMetadata({
  params,
}: InvestmentPageProps): Promise<Metadata> {
  const { bairro } = await params
  const neighborhood = await getNeighborhood(bairro)

  if (!neighborhood) {
    return { title: 'Bairro não encontrado' }
  }

  const title = `Investir em ${neighborhood.name} - Guia Completo de Investimento Imobiliário`
  const description = `Descubra por que ${neighborhood.name} é uma excelente opção para investimento imobiliário. Análise de preços, tendências e oportunidades.`
  const url = `${SITE_CONFIG.url}/investir/${neighborhood.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
    },
  }
}

export default async function InvestmentPage({ params }: InvestmentPageProps) {
  const { bairro } = await params
  const neighborhood = await getNeighborhood(bairro)

  if (!neighborhood) {
    notFound()
  }

  const stats = await calculateInvestmentStats(neighborhood)
  const investmentProperties = neighborhood.addresses
    .map((addr: any) => addr.property)
    .filter((p: any) => p && p.allowAirbnb)

  // Schema.org para página de investimento
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Investir em ${neighborhood.name}`,
    description: `Guia completo de investimento imobiliário em ${neighborhood.name}`,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    about: {
      '@type': 'Place',
      name: neighborhood.name,
      containedInPlace: {
        '@type': 'City',
        name: neighborhood.city.name,
      },
    },
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Investir', url: '/investir' },
    { name: neighborhood.name, url: `/investir/${neighborhood.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/investir">Investir</Link>
          <span>/</span>
          <span className="text-foreground">{neighborhood.name}</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">
          Investir em {neighborhood.name}
        </h1>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border rounded-lg">
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Preço Médio/m²</p>
              <p className="text-2xl font-bold">
                R$ {stats.avgPricePerM2.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Preço Médio</p>
              <p className="text-2xl font-bold">
                R$ {stats.avgPrice.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Imóveis Disponíveis</p>
              <p className="text-2xl font-bold">{stats.totalProperties}</p>
            </div>
          </div>
        )}

        {/* Conteúdo sobre investimento */}
        <div className="prose prose-lg max-w-none mb-12">
          <h2>Por que investir em {neighborhood.name}?</h2>
          <p>
            {neighborhood.name} é uma das melhores opções para investimento
            imobiliário em {neighborhood.city.name}. Com localização privilegiada
            e infraestrutura completa, o bairro oferece excelente potencial de
            valorização e rentabilidade.
          </p>
          
          {/* Adicionar mais conteúdo baseado em dados do bairro */}
        </div>

        {/* FAQs sobre investimento */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Perguntas Frequentes sobre Investimento
          </h2>
          <div className="space-y-4">
            <details className="p-4 border rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Qual o potencial de valorização em {neighborhood.name}?
              </summary>
              <p className="mt-2 text-muted-foreground">
                {neighborhood.name} apresenta histórico de valorização acima da
                média, com crescimento consistente nos últimos anos...
              </p>
            </details>
            {/* Mais FAQs */}
          </div>
        </div>

        {/* Imóveis para investimento */}
        {investmentProperties.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Imóveis Ideais para Investimento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentProperties.map((property: any) => (
                <PropertyCard key={property.id} property={...} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
```

### 3.6 Melhorar Geo Sitemap KML

#### Atualizar `app/geo-sitemap.kml/route.ts`

```typescript
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export async function GET() {
  const baseUrl = SITE_CONFIG.url

  // Usar Address.lat/lng ao invés de Property.lat/lng
  const properties = await db.property.findMany({
    where: { published: true },
    include: {
      address: {
        where: {
          lat: { not: null },
          lng: { not: null },
        },
      },
      images: { take: 1 },
    },
  })

  // Incluir bairros também
  const neighborhoods = await db.neighborhood.findMany({
    where: {
      published: true,
      lat: { not: null },
      lng: { not: null },
    },
    include: {
      city: { include: { state: true } },
    },
  })

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Gabriel Alberto Imóveis - Mapa Completo</name>
    <description>Localização de imóveis e bairros</description>
    
    <!-- Estilo para imóveis -->
    <Style id="property-icon">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>
    
    <!-- Estilo para bairros -->
    <Style id="neighborhood-icon">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>

    <!-- Folder de Imóveis -->
    <Folder>
      <name>Imóveis</name>
      <description>Imóveis disponíveis</description>
${properties
  .filter((p) => p.address?.lat && p.address?.lng)
  .map(
    (property) => `      <Placemark>
        <name>${escapeXml(property.title)}</name>
        <description><![CDATA[
          <strong>${escapeXml(property.title)}</strong><br/>
          ${property.address?.neighborhood?.name || property.address?.district || 'São Paulo'}, ${property.address?.neighborhood?.city?.name || property.address?.city || 'São Paulo'}<br/>
          ${property.price ? `Preço: R$ ${parseFloat(property.price.toString()).toLocaleString('pt-BR')}` : 'Consulte'}
          <br/><br/>
          <a href="${baseUrl}/imoveis/${property.slug}">Ver detalhes</a>
        ]]></description>
        <styleUrl>#property-icon</styleUrl>
        <Point>
          <coordinates>${property.address!.lng},${property.address!.lat},0</coordinates>
        </Point>
      </Placemark>`
  )
  .join('\n')}
    </Folder>

    <!-- Folder de Bairros -->
    <Folder>
      <name>Bairros</name>
      <description>Bairros com imóveis disponíveis</description>
${neighborhoods
  .map(
    (neighborhood) => `      <Placemark>
        <name>${escapeXml(neighborhood.name)}</name>
        <description><![CDATA[
          <strong>${escapeXml(neighborhood.name)}</strong><br/>
          ${neighborhood.city?.name || 'São Paulo'}, ${neighborhood.city?.state?.code || 'SP'}<br/>
          <a href="${baseUrl}/bairros/${neighborhood.slug}">Ver bairro</a>
        ]]></description>
        <styleUrl>#neighborhood-icon</styleUrl>
        <Point>
          <coordinates>${neighborhood.lng},${neighborhood.lat},0</coordinates>
        </Point>
      </Placemark>`
  )
  .join('\n')}
    </Folder>
  </Document>
</kml>`

  return new Response(kml, {
    headers: {
      'Content-Type': 'application/vnd.google-earth.kml+xml',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
```

### 3.7 Adicionar FAQs Estruturados

#### Criar componente `components/faq-section.tsx`

```typescript
import { SITE_CONFIG } from '@/lib/constants'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
}

export function FAQSection({ faqs, title = 'Perguntas Frequentes' }: FAQSectionProps) {
  // Schema.org FAQPage
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="p-4 border rounded-lg hover:bg-muted/50 transition"
            >
              <summary className="font-semibold cursor-pointer">
                {faq.question}
              </summary>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
```

### 3.8 Melhorar Sitemap com Regiões e Investimento

#### Atualizar `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bairros`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/investir`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/minha-casa-minha-vida`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // ... outras páginas estáticas
  ]

  // Properties
  const properties = await db.property.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const propertySitemaps: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
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

  // Regions
  const regions = await db.region.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const regionSitemaps: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${baseUrl}/regiao/${region.slug}`,
    lastModified: region.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Investment pages (por bairro)
  const investmentSitemaps: MetadataRoute.Sitemap = neighborhoods.map(
    (neighborhood) => ({
      url: `${baseUrl}/investir/${neighborhood.slug}`,
      lastModified: neighborhood.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })
  )

  return [
    ...staticPages,
    ...propertySitemaps,
    ...neighborhoodSitemaps,
    ...regionSitemaps,
    ...investmentSitemaps,
  ]
}
```

### 3.9 Adicionar Performance Monitoring

#### Instalar e configurar `@vercel/speed-insights`

```bash
pnpm add @vercel/speed-insights
```

#### Atualizar `app/layout.tsx`

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 3.10 Melhorar Acessibilidade

#### Adicionar `aria-label` e semântica HTML

```typescript
// Em páginas de imóveis, usar <article>
<article>
  <header>
    <h1>{property.title}</h1>
  </header>
  <main>
    {/* Conteúdo */}
  </main>
</article>

// Em breadcrumbs
<nav aria-label="Breadcrumb">
  <ol>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/imoveis">Imóveis</Link></li>
    <li aria-current="page">{property.title}</li>
  </ol>
</nav>

// Em imagens, sempre ter alt
<Image
  src={image.url}
  alt={image.alt || property.title}
  // ...
/>
```

---

## 4. 🚀 ESTRATÉGIA DE CRESCIMENTO ORGÂNICO E PROGRAMÁTICO

### 4.1 SEO Programático - Geração Automática de Conteúdo

#### Estratégia de Páginas Dinâmicas

1. **Páginas de Bairro Melhoradas**
   - Gerar estatísticas automáticas (preço médio, crescimento)
   - Listar imóveis do bairro
   - Conteúdo sobre infraestrutura (escolas, shoppings, transporte)
   - Comparação com bairros próximos

2. **Páginas de Região**
   - Agrupar bairros por região
   - Estatísticas consolidadas
   - Tendências de mercado
   - Guias de investimento por região

3. **Páginas de Investimento**
   - Análise de ROI por bairro
   - Comparação de preços
   - Tendências de valorização
   - FAQs sobre investimento

4. **Páginas de Tipo de Imóvel**
   - `/apartamentos/[bairro]`
   - `/casas/[bairro]`
   - `/studios/[bairro]`
   - Com conteúdo específico para cada tipo

### 4.2 Conteúdo para IAs (SGE, Perplexity, ChatGPT)

#### Estrutura de Conteúdo Semântico

1. **FAQs Estruturados**
   - Perguntas comuns sobre imóveis
   - Perguntas sobre bairros
   - Perguntas sobre investimento
   - Usar Schema.org FAQPage

2. **Listas e Tabelas**
   - Top 10 bairros para investimento
   - Comparação de preços por região
   - Tabela de comodidades
   - Lista de construtoras

3. **Definições e Glossário**
   - Termos imobiliários
   - Tipos de imóveis
   - Status de construção
   - Usar Schema.org DefinedTerm

4. **Relacionamentos Explícitos**
   - "Imóveis similares em bairros próximos"
   - "Bairros com características similares"
   - "Regiões com melhor custo-benefício"

### 4.3 Estratégia de Links Internos

#### Estrutura de Links Semânticos

1. **Breadcrumbs em Todas as Páginas**
   - Home > Imóveis > [Imóvel]
   - Home > Bairros > [Bairro]
   - Home > Região > [Região]
   - Home > Investir > [Bairro]

2. **Links Contextuais**
   - Em páginas de imóveis: link para bairro, região, imóveis similares
   - Em páginas de bairro: link para região, imóveis do bairro, bairros próximos
   - Em páginas de região: link para bairros, imóveis da região

3. **Sitemap HTML**
   - Página `/sitemap` com links para todas as páginas importantes
   - Organizado por categoria
   - Útil para crawlers e usuários

### 4.4 Estratégia de Conteúdo Local

#### Otimização para Buscas Locais

1. **Google Business Profile**
   - Integração com dados do site
   - Reviews e avaliações
   - Horários e contato

2. **Dados Locais Estruturados**
   - LocalBusiness schema em páginas institucionais
   - GeoCoordinates em todas as páginas relevantes
   - Área de cobertura definida

3. **Conteúdo sobre Localização**
   - "Imóveis próximos a [ponto de interesse]"
   - "Imóveis a X km do centro"
   - Mapas interativos

---

## 5. ✅ CHECKLIST TÉCNICO FINAL

### 5.1 SEO Tradicional

- [x] Title único e otimizado em todas as páginas
- [x] Description única (150-160 caracteres)
- [x] Canonical URLs configuradas
- [x] Robots meta tags
- [x] Sitemap.xml dinâmico
- [x] Robots.txt configurado
- [ ] **PENDENTE:** Remover hreflang para páginas EN que não existem
- [ ] **PENDENTE:** Adicionar noindex em páginas de busca vazias

### 5.2 Schema.org (JSON-LD)

- [x] WebSite com SearchAction
- [x] Organization/RealEstateAgent
- [x] Residence para imóveis
- [x] Place para bairros
- [x] BreadcrumbList
- [ ] **PENDENTE:** Offer completo (priceValidUntil, availability)
- [ ] **PENDENTE:** FAQPage para FAQs
- [ ] **PENDENTE:** LocalBusiness para páginas institucionais
- [ ] **PENDENTE:** ItemList para listagens
- [ ] **PENDENTE:** Article para páginas de investimento

### 5.3 GEO SEO

- [x] Geo tags (geo.region, geo.position, ICBM)
- [x] GeoCoordinates em Schema.org
- [x] Geo sitemap KML
- [ ] **PENDENTE:** Usar Address.lat/lng ao invés de Property.lat/lng
- [ ] **PENDENTE:** Incluir bairros no KML
- [ ] **PENDENTE:** Adicionar geo.radius para área de cobertura

### 5.4 SEO para IAs

- [ ] **PENDENTE:** FAQs estruturados (Schema.org FAQPage)
- [ ] **PENDENTE:** Conteúdo semântico rico (listas, tabelas)
- [ ] **PENDENTE:** Relacionamentos explícitos entre entidades
- [ ] **PENDENTE:** Glossário de termos imobiliários
- [ ] **PENDENTE:** Comparações e rankings estruturados

### 5.5 Performance

- [x] Next.js Image optimization
- [x] Revalidate configurado
- [ ] **PENDENTE:** Adicionar @vercel/speed-insights
- [ ] **PENDENTE:** Lazy loading de componentes
- [ ] **PENDENTE:** Otimização de queries (evitar N+1)

### 5.6 Acessibilidade

- [x] Semântica HTML básica
- [ ] **PENDENTE:** Adicionar aria-label em elementos interativos
- [ ] **PENDENTE:** Alt text em todas as imagens
- [ ] **PENDENTE:** Testes de acessibilidade (axe-core)
- [ ] **PENDENTE:** Navegação por teclado

### 5.7 Páginas Programáticas

- [x] Páginas de imóveis dinâmicas
- [x] Páginas de bairros dinâmicas
- [ ] **PENDENTE:** Páginas de região
- [ ] **PENDENTE:** Páginas de investimento por bairro
- [ ] **PENDENTE:** Página Minha Casa Minha Vida
- [ ] **PENDENTE:** Páginas por tipo de imóvel

### 5.8 Conteúdo e Estrutura

- [x] Breadcrumbs em páginas hierárquicas
- [ ] **PENDENTE:** Links internos contextuais
- [ ] **PENDENTE:** Sitemap HTML
- [ ] **PENDENTE:** Conteúdo rico em páginas de bairro
- [ ] **PENDENTE:** Estatísticas e dados locais

---

## 6. 🛠️ FERRAMENTAS E BIBLIOTECAS RECOMENDADAS

### 6.1 SEO

1. **next-seo** (opcional)
   - Facilita geração de metadados
   - Já está bem implementado com Metadata API do Next.js

2. **schema-dts**
   - TypeScript types para Schema.org
   - Garante tipos corretos

3. **next-sitemap** (opcional)
   - Geração automática de sitemap
   - Já está implementado manualmente

### 6.2 Performance

1. **@vercel/speed-insights**
   - Monitoramento de Core Web Vitals
   - Já mencionado acima

2. **@next/bundle-analyzer**
   - Análise de tamanho de bundles
   - Identificar dependências pesadas

### 6.3 Acessibilidade

1. **@axe-core/react**
   - Testes de acessibilidade em desenvolvimento
   - Integrar com ESLint

2. **eslint-plugin-jsx-a11y**
   - Regras de acessibilidade no ESLint
   - Validação automática

### 6.4 Analytics e Monitoramento

1. **Google Search Console**
   - Monitorar indexação
   - Verificar erros de crawl
   - Analisar queries de busca

2. **Google Analytics 4**
   - Tracking de eventos
   - Análise de comportamento

3. **Vercel Analytics**
   - Já implementado
   - Performance monitoring

---

## 7. 📈 PRÓXIMOS PASSOS PRIORITÁRIOS

### Fase 1: Correções Críticas (1-2 semanas)

1. ✅ Corrigir uso de `Address.lat/lng` ao invés de `Property.lat/lng`
2. ✅ Remover hreflang para páginas EN inexistentes
3. ✅ Implementar páginas de região (`/regiao/[slug]`)
4. ✅ Implementar páginas de investimento (`/investir/[bairro]`)
5. ✅ Melhorar Schema.org (Offer completo, FAQPage)

### Fase 2: Melhorias de SEO (2-3 semanas)

1. ✅ Adicionar FAQs estruturados
2. ✅ Melhorar conteúdo de páginas de bairro
3. ✅ Implementar sitemap HTML
4. ✅ Adicionar links internos contextuais
5. ✅ Otimizar queries do banco (evitar N+1)

### Fase 3: SEO para IAs (3-4 semanas)

1. ✅ Criar glossário de termos imobiliários
2. ✅ Adicionar comparações e rankings estruturados
3. ✅ Implementar relacionamentos explícitos
4. ✅ Criar conteúdo semântico rico (listas, tabelas)
5. ✅ Implementar página Minha Casa Minha Vida

### Fase 4: Performance e Acessibilidade (1-2 semanas)

1. ✅ Adicionar @vercel/speed-insights
2. ✅ Otimizar imagens (lazy loading, placeholders)
3. ✅ Adicionar testes de acessibilidade
4. ✅ Melhorar semântica HTML
5. ✅ Adicionar aria-labels

---

## 8. 📝 CONCLUSÃO

O projeto **Gabriel Alberto Imóveis** já possui uma base sólida de SEO técnico, com:
- ✅ Estrutura de dados bem organizada
- ✅ Schema.org básico implementado
- ✅ Metadados completos
- ✅ Sitemap e robots configurados

**Principais melhorias necessárias:**
1. Completar Schema.org (Offer, FAQPage, LocalBusiness)
2. Implementar páginas faltantes (região, investimento, MCMV)
3. Adicionar conteúdo rico para IAs (FAQs, listas, comparações)
4. Melhorar performance e acessibilidade
5. Otimizar queries e cache

Com essas implementações, o site estará **bem posicionado** para:
- 🎯 Ranquear no Google (SEO tradicional)
- 🎯 Aparecer em buscas locais (GEO SEO)
- 🎯 Ser compreendido por IAs (SGE, Perplexity, ChatGPT)
- 🎯 Escalar com SEO programático

**Prioridade:** Começar pela Fase 1 (correções críticas) e seguir sequencialmente.

---

**Relatório gerado em:** Novembro 2024  
**Próxima revisão recomendada:** Após implementação da Fase 1

c
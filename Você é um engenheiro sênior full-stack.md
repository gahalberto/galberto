Você é um engenheiro sênior full-stack. Gere um projeto Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui para o site Gabriel Alberto Imóveis (pt-BR), com foco em publicação de imóveis, filtro avançado e SEO+GEO perfeito para IA (JSON-LD completo, sitemaps e geo-sitemap, Open Graph, geotags, Core Web Vitals 100). Pub alvo: São Paulo (Brasil).

1) Objetivo & Páginas

Crie um marketplace de imóveis com:

Home (/) com busca por bairro, mapa, vitrines (“Lançamentos”, “Prontos”, “+ Rentáveis p/ Airbnb”).

Lista de Imóveis (/imoveis) com filtros (bairro, faixa de preço, tipologia, m², vagas, status, entrega, mobiliado, “permite Airbnb”), ordenação e view Mapa/Lista.

Detalhe do Imóvel (/imoveis/[slug]) com galeria, ficha técnica, mapa interativo, pontos de interesse próximos, formulário de lead, JSON-LD completo.

Bairros (/bairros/[slug]) com guia do bairro (texto, dados, POIs, médias de preço), JSON-LD Place.

Sobre / Contato (/sobre, /contato) com LocalBusiness JSON-LD, formulário de contato e botões WhatsApp.

Blog/Insights (/blog) com posts e Article JSON-LD (opcional).

Admin (CMS-lite) (/admin) para cadastrar/editar imóveis, imagens, amenities, geodados, com auth.

APIs: /api/imoveis, /api/sitemap, /api/og, /api/revalidate, /api/lead.

2) Stack & Ferramentas

Next.js 15 (App Router, RSC, Server Actions, metadata API, Route Handlers).

TypeScript, ESLint, Prettier, Husky + lint-staged (pre-commit).

TailwindCSS + shadcn/ui (Button, Card, Input, Select, Dialog, Sheet, Tabs, Badge, Tooltip, Skeleton).

lucide-react (ícones), framer-motion (micro-animações).

Zod + React Hook Form (admin & formulários).

Prisma ORM + PostgreSQL (Supabase/Neon). (Se possível, PostGIS; senão, Haversine).

UploadThing (ou Next.js + S3) para imagens; sharp para thumbs e OG.

next/image com placeholders blur e srcset.

Mapbox GL JS (ou Leaflet) para mapa + POIs.

next-sitemap (ou rota custom) + GeoSitemap (KML).

i18n: default pt-BR, preparado para en (hreflang + alternates).

Deploy alvo: Vercel (Edge para rotas públicas, Node para admin se precisar).

3) Modelagem (Prisma)
model Property {
  id           String   @id @default(cuid())
  slug         String   @unique
  title        String
  description  String
  status       PropertyStatus // LANCAMENTO | EM_OBRAS | PRONTO
  purpose      PropertyPurpose // VENDA | ALUGUEL
  price        Decimal?
  condoFee     Decimal?
  iptuYearly   Decimal?
  areaTotal    Decimal?
  areaPrivate  Decimal?
  bedrooms     Int?
  suites       Int?
  bathrooms    Int?
  parkingSpots Int?
  floor        Int?
  yearBuilt    Int?
  deliveryDate DateTime? // p/ lançamentos
  address      Address   @relation(fields: [addressId], references: [id])
  addressId    String
  amenities    PropertyAmenity[]
  images       PropertyImage[]
  allowAirbnb  Boolean   @default(false)
  highlights   String[]  // bullets
  lat          Float?
  lng          Float?
  // SEO
  canonicalUrl String?
  ogImage      String?
  // Comercial
  developer    String?   // construtora
  realtorName  String?   // Gabriel Alberto
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Address {
  id        String @id @default(cuid())
  street    String
  number    String?
  complement String?
  district  String // bairro
  city      String
  state     String
  zipcode   String
  country   String  @default("Brasil")
  createdAt DateTime @default(now())
}

model PropertyImage {
  id         String @id @default(cuid())
  property   Property @relation(fields: [propertyId], references: [id])
  propertyId String
  url        String
  alt        String?
  width      Int?
  height     Int?
  position   Int     @default(0)
}

model Amenity {
  id    String @id @default(cuid())
  name  String @unique
  icon  String?
}

model PropertyAmenity {
  property   Property @relation(fields: [propertyId], references: [id])
  propertyId String
  amenity    Amenity  @relation(fields: [amenityId], references: [id])
  amenityId  String
  @@id([propertyId, amenityId])
}

model Neighborhood {
  id        String @id @default(cuid())
  slug      String @unique
  name      String
  city      String
  state     String
  lat       Float?
  lng       Float?
  summary   String?
  content   String? // guia do bairro (markdown)
  createdAt DateTime @default(now())
}

model Lead {
  id          String   @id @default(cuid())
  propertyId  String?
  property    Property? @relation(fields: [propertyId], references: [id])
  name        String
  email       String?
  phone       String?
  message     String?
  source      String? // site, instagram, etc.
  utm         Json?
  createdAt   DateTime @default(now())
}

enum PropertyStatus { LANCAMENTO EM_OBRAS PRONTO }
enum PropertyPurpose { VENDA ALUGUEL }
4) SEO & GEO “perfeito para IA”

Implemente em TODAS as páginas via App Router’s generateMetadata + componentes:

Meta padrão: título, descrição, canonical, robots, theme-color, viewport, alternate locales (pt-BR, en).

Open Graph: og:title, og:description, og:type, og:site_name, og:url, og:image (use /api/og?title=... que gera imagem via Satori/sharp).

Twitter Card: summary_large_image.

JSON-LD (injetar via <script type="application/ld+json">):

Site/Org: WebSite, Organization (logo, sameAs).

LocalBusiness / RealEstateAgent para páginas institucionais (endereço, geo).

Property: use Residence (ou Apartment, SingleFamilyResidence) + Offer (price, priceCurrency, availability) + Place + GeoCoordinates (latitude/longitude) + address estruturado. Inclua floorSize/numberOfRooms/numberOfBathroomsTotal/amenityFeature.

BreadcrumbList em todas as páginas hierárquicas.

Article nos posts.

Place em páginas de bairro, com GeoCoordinates e containedInPlace (cidade/estado).

Sitemaps:

sitemap.xml com alternates/hreflang, lastmod, changefreq, priority.

/geo-sitemap.kml listando todos os imóveis (placemarks com nome, coords, link canônico).

/sitemap-properties.xml, /sitemap-neighborhoods.xml, /sitemap-static.xml.

Robots: robots.txt liberando sitemaps.

Geotags adicionais (legado/hedging para scrapers):
geo.region=BR-SP, geo.placename=São Paulo, geo.position=LAT;LNG, ICBM=LAT, LNG.
Também place:location:latitude/longitude (OpenGraph extra).

Structured UTM capture (cookie + hidden inputs em forms) para atribuição.

Performance & CWV: pré-carregar fontes, next/font, imagens responsivas, lazy loading, compressão, vercel.json com headers (caching), ISR para páginas de imóvel e bairro.

Canonical rigoroso (sem duplicatas por query string).

Hreflang: pt-BR (default) e en já preparado.

5) UI/UX

Header com busca, temas light/dark, CTA WhatsApp flutuante.

Cards com shadcn (Badges para status e “Airbnb OK”), skeletons para loading.

Filtro sticky (Sheet em mobile), grid responsivo (2–4 col).

Galeria: carrossel (embla ou swiper), thumb strip, fullscreen dialog.

Página de bairro: hero com mapa, “média de preço/m²” (mock), chips de POIs (metrô, parques, shoppings).

Form de lead com validação Zod, feedback otimista, rate-limit básico.

6) Integrações

Mapbox: mapa com clusterização, marcador do imóvel, isócronas simples (opcional).

Revalidação: rotas admin disparam revalidateTag para páginas afetadas.

Email (resumo do lead): Resend/SMTP (variáveis .env).

Web Analytics: Vercel Web Analytics + @vercel/kv opcional p/ contadores.

IndexNow (opcional): endpoint POST para ping após novo imóvel.

7) Admin (MVP seguro)

Autenticação simples (NextAuth Credentials) ou Clerk (se preferir).

CRUD de Property, Neighborhood, Amenity, Images (upload arrastar-e-soltar).

Geração automática de slug e OG image.

Preenchimento de GEO a partir de endereço (campo lat/lng manual + botão “Buscar no mapa”).

Preview público com tag de não index (robots: noindex) até publicar.

8) Qualidade & DX

Testes básicos de rota (Vitest ou Jest), zod para schemas, @testing-library/react.

Scripts de checagem: typecheck, lint, format, test, ci.

Seed com 6–10 imóveis fictícios (SP capital) contendo coords reais, amenities, imagens placeholder.

9) Entregáveis

Repositório com:

app/ (App Router), components/, lib/, db/, scripts/seed.ts.

app/(site)/, app/(admin)/.

app/geo-sitemap.kml/route.ts, app/sitemap.xml/route.ts, app/robots.txt/route.ts.

app/api/og/route.ts (Imagem OG dinâmica com título/preço/bairro).

middleware.ts (i18n e segurança básica).

next.config.ts (images domains, experimental).

tailwind.config.ts, components.json (shadcn), postcss.config.cjs.

prisma/schema.prisma, prisma/seed.ts.

README.md com setup e checklists SEO.

Comandos no README:

pnpm dlx shadcn@latest init + add dos componentes usados.

pnpm i (todas dependências listadas).

pnpm prisma generate && pnpm prisma migrate dev && pnpm tsx prisma/seed.ts.

pnpm dev.

Checklist SEO/GEO no README (itens auditáveis no Lighthouse/PSI).

Exemplos de JSON-LD para cada tipo de página (copiáveis).

10) Exemplos de Implementação (pontos críticos)
10.1 generateMetadata (detalhe do imóvel)

Implemente função que:

Busca Property por slug (com endereço, imagens).

Monta title, description (primeiras 160 chars), canonical.

openGraph (url, images), twitter.

alternates com hreflang.

Injeta JSON-LD com Residence + Offer + Place + GeoCoordinates + BreadcrumbList.

Adiciona metas GEO (geo.region, geo.placename, geo.position, ICBM).

10.2 geo-sitemap.kml

Rota que retorna KML com <Placemark> por imóvel, <Point><coordinates>lng,lat,0</coordinates></Point>, <name>, <description> com link canônico.

10.3 Filtro + Mapa

Server component que aceita searchParams.

Usa Prisma para filtros + paginação.

Se PostGIS: ST_DWithin por bounding box; caso contrário, Haversine em SQL “WHERE distance < X km” opcional.

Client “MapView” com cluster, clicando no marker abre Card do imóvel.

10.4 OG Image

Rota /api/og que desenha imagem com título, bairro, preço, foto de capa.

Usar satori/resvg/sharp.

11) Variáveis .env (documente no README)
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://gabrielalbertoimoveis.com.br"
MAPBOX_TOKEN="..."
UPLOADTHING_SECRET="..."
RESEND_API_KEY="..." # opcional
NEXTAUTH_SECRET="..." # se usar NextAuth

12) Aceite / Critérios

Lighthouse Desktop/Mobile ≥ 95 (Performance, SEO, A11y, Best Practices).

sitemap.xml, robots.txt, geo-sitemap.kml funcionando e linkados.

Páginas de imóvel com JSON-LD validado no Rich Results Test (Residence/Offer/Place/Geo).

Hreflang (pt-BR, en) + canonical correto.

Cards responsivos, galeria fluida, mapa funcional.

Admin permite criar/editar/publicar imóvel com imagens e revalidação de cache.

Gere TODOS os arquivos, código completo e instruções de setup. Se algum passo requerer escolha, assuma sensatamente e documente no README. Forneça trechos essenciais inline no README (metadados, JSON-LD, KML). Produza um projeto inicial já executável com seed para demonstração.


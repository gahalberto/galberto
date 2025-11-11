# Gabriel Alberto Imóveis

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

Marketplace de imóveis moderno e completo desenvolvido com Next.js 15 (App Router), TypeScript, Prisma e TailwindCSS. Otimizado para SEO e indexação por IA com JSON-LD completo, sitemaps e geolocalização.

## 🚀 Características Principais

### 🏠 **Funcionalidades do Site**
- ✅ Home page com seções destacadas (Lançamentos, Prontos, Airbnb)
- ✅ Sistema de filtros avançado (bairro, preço, tipologia, status)
- ✅ Páginas de detalhes completas com galeria de imagens
- ✅ Guias de bairros com informações e preços médios
- ✅ Formulário de leads com captura de UTM
- ✅ Botão flutuante do WhatsApp
- ✅ Design responsivo e moderno com shadcn/ui
- ✅ Dark mode ready

### 🎯 **SEO & Otimização para IA**
- ✅ JSON-LD completo em todas as páginas
  - WebSite & Organization schema
  - Residence schema com Offer detalhado
  - Place schema para bairros
  - BreadcrumbList em páginas hierárquicas
- ✅ Open Graph completo
- ✅ Twitter Cards
- ✅ Geotags (geo.region, geo.position, ICBM, place:location)
- ✅ Sitemap.xml com hreflang (pt-BR/en)
- ✅ Geo-sitemap.kml com coordenadas de todos os imóveis
- ✅ robots.txt configurado
- ✅ Canonical URLs rigorosos
- ✅ ISR (Incremental Static Regeneration) configurado
- ✅ Core Web Vitals otimizado

### 🔐 **Área Administrativa**
- ✅ Autenticação segura com NextAuth
- ✅ Dashboard com estatísticas
- ✅ CRUD de imóveis
- ✅ Gerenciamento de bairros
- ✅ Visualização de leads
- ✅ Sistema de publicação/rascunho

### 🛠 **Stack Técnica**
- **Framework**: Next.js 15 (App Router, RSC, Server Actions)
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS + shadcn/ui
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: NextAuth.js
- **Validação**: Zod
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **Analytics**: Vercel Analytics

## 📋 Pré-requisitos

- Node.js 20+ 
- pnpm 9+
- PostgreSQL (local ou Supabase/Neon)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/gabrielimoveis.git
cd gabrielimoveis
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gabrielimoveis"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Gabriel Alberto Imóveis"

# Mapbox (opcional - para mapas)
NEXT_PUBLIC_MAPBOX_TOKEN="seu_token_aqui"

# NextAuth
NEXTAUTH_SECRET="gere_um_secret_aleatorio_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Admin (para seed inicial)
ADMIN_EMAIL="admin@gabrielalbertoimoveis.com.br"
ADMIN_PASSWORD="sua_senha_segura"
```

### 4. Configure o banco de dados

```bash
# Gerar o Prisma Client
pnpm db:generate

# Criar as tabelas no banco
pnpm db:push

# Ou usar migrations (recomendado para produção)
pnpm db:migrate

# Popular o banco com dados de exemplo
pnpm db:seed
```

### 5. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse:
- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Login**: Use as credenciais definidas no .env

## 📁 Estrutura do Projeto

```
gabrielimoveis/
├── app/
│   ├── (site)/              # Páginas públicas
│   │   ├── page.tsx         # Home
│   │   ├── imoveis/         # Lista e detalhe
│   │   ├── bairros/         # Bairros
│   │   ├── sobre/           # Institucional
│   │   └── contato/         # Contato
│   ├── (admin)/             # Área administrativa
│   │   └── admin/
│   │       ├── page.tsx     # Dashboard
│   │       ├── imoveis/     # Gestão de imóveis
│   │       ├── leads/       # Leads recebidos
│   │       └── login/       # Login
│   ├── api/                 # API Routes
│   │   ├── lead/            # Captura de leads
│   │   ├── og/              # Open Graph images
│   │   ├── revalidate/      # Revalidação de cache
│   │   └── auth/            # NextAuth
│   ├── sitemap.xml/         # Sitemap dinâmico
│   ├── geo-sitemap.kml/     # Geo sitemap
│   ├── robots.txt/          # Robots.txt
│   ├── layout.tsx           # Layout raiz
│   └── globals.css          # Estilos globais
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── header.tsx           # Cabeçalho
│   ├── footer.tsx           # Rodapé
│   ├── property-card.tsx    # Card de imóvel
│   ├── lead-form.tsx        # Formulário de lead
│   └── ...
├── lib/
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # Configuração NextAuth
│   ├── utils.ts             # Funções utilitárias
│   ├── constants.ts         # Constantes do site
│   └── seo.ts               # Helpers de SEO/JSON-LD
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Dados de exemplo
├── next.config.ts           # Configuração Next.js
├── tailwind.config.ts       # Configuração Tailwind
└── package.json
```

## 🗄️ Modelagem do Banco de Dados

### Models Principais

- **Property**: Imóveis (título, descrição, preço, características, localização)
- **Address**: Endereços dos imóveis
- **PropertyImage**: Imagens dos imóveis
- **Amenity**: Comodidades disponíveis
- **PropertyAmenity**: Relação N:N entre imóveis e amenities
- **Neighborhood**: Bairros com guias e informações
- **Lead**: Leads capturados pelo site
- **User**: Usuários do sistema (admin)

## 🎨 Componentes UI

O projeto utiliza **shadcn/ui** com os seguintes componentes:

- Button, Card, Input, Label, Select
- Dialog, Sheet, Tabs, Separator
- Badge, Skeleton, Toast, Tooltip
- E mais...

Para adicionar novos componentes:

```bash
pnpx shadcn@latest add [component-name]
```

## 🔍 SEO - Checklist de Implementação

### ✅ Meta Tags Básicas
- [x] Title otimizado em todas as páginas
- [x] Description única por página
- [x] Canonical URLs
- [x] Robots meta tag
- [x] Viewport e theme-color

### ✅ Open Graph
- [x] og:title, og:description
- [x] og:type (website, article)
- [x] og:image (dinâmico via /api/og)
- [x] og:url, og:site_name

### ✅ Twitter Cards
- [x] twitter:card (summary_large_image)
- [x] twitter:title, twitter:description
- [x] twitter:image

### ✅ JSON-LD Schema
- [x] WebSite schema
- [x] Organization / RealEstateAgent schema
- [x] Residence schema com Offer
- [x] Place schema (com GeoCoordinates)
- [x] BreadcrumbList
- [x] Article (para blog, se implementado)

### ✅ Geolocalização
- [x] geo.region (BR-SP)
- [x] geo.placename
- [x] geo.position (lat;lng)
- [x] ICBM (lat, lng)
- [x] place:location:latitude/longitude

### ✅ Sitemaps
- [x] sitemap.xml com hreflang
- [x] geo-sitemap.kml com placemarks
- [x] robots.txt referenciando sitemaps

### ✅ Performance
- [x] Next/Image com lazy loading
- [x] ISR (Incremental Static Regeneration)
- [x] Cache headers otimizados
- [x] Fontes otimizadas

## 🌐 Exemplos de JSON-LD

### Property (Residence) Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Residence",
  "name": "Apartamento Moderno no Jardins",
  "description": "Apartamento de alto padrão...",
  "url": "https://gabrielalbertoimoveis.com.br/imoveis/apartamento-moderno-jardins",
  "image": ["https://..."],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Augusta, 1500",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "postalCode": "01304-001",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -23.5615,
    "longitude": -46.6693
  },
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": 150,
    "unitCode": "MTK"
  },
  "numberOfRooms": 3,
  "numberOfBathroomsTotal": 3,
  "offers": {
    "@type": "Offer",
    "price": 2500000,
    "priceCurrency": "BRL",
    "availability": "https://schema.org/InStock"
  }
}
```

### Place (Neighborhood) Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Place",
  "name": "Vila Mariana",
  "description": "Bairro charmoso e arborizado...",
  "url": "https://gabrielalbertoimoveis.com.br/bairros/vila-mariana",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -23.5881,
    "longitude": -46.6389
  },
  "containedInPlace": {
    "@type": "City",
    "name": "São Paulo",
    "containedInPlace": {
      "@type": "State",
      "name": "SP"
    }
  }
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático! 🎉

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Vercel
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build para produção
pnpm start            # Inicia servidor de produção

# Banco de Dados
pnpm db:generate      # Gera Prisma Client
pnpm db:push          # Sincroniza schema com DB (dev)
pnpm db:migrate       # Cria migration
pnpm db:seed          # Popula banco com dados
pnpm db:studio        # Abre Prisma Studio

# Qualidade de Código
pnpm lint             # Executa ESLint
pnpm typecheck        # Verifica tipos TypeScript
pnpm format           # Formata código com Prettier
pnpm format:check     # Verifica formatação
pnpm ci               # Executa todos os checks
```

## 🔒 Segurança

- Autenticação com NextAuth (JWT)
- Senhas hasheadas com bcrypt
- Validação de dados com Zod
- CORS configurado
- Rate limiting recomendado para produção
- Headers de segurança configurados

## 📊 Performance & Core Web Vitals

O projeto é otimizado para atingir:
- ✅ Lighthouse Score > 95
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FID (First Input Delay) < 100ms
- ✅ CLS (Cumulative Layout Shift) < 0.1

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence à Gabriel Alberto Imóveis.

## 🆘 Suporte

Para dúvidas ou problemas:
- Email: contato@gabrielalbertoimoveis.com.br
- WhatsApp: +55 11 99999-9999

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Vercel](https://vercel.com/)

---

Desenvolvido com ❤️ para Gabriel Alberto Imóveis


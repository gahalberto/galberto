# 🗺️ Migração de Localização Hierárquica - Gabriel Imóveis

## 📋 Resumo Executivo

Esta migração adiciona uma estrutura hierárquica completa de localização ao seu projeto, seguindo as melhores práticas de modelagem geoespacial e mantendo **100% de compatibilidade** com dados existentes.

### ✨ O que foi implementado

- ✅ **Modelos hierárquicos**: State → City → Region → Neighborhood → Address
- ✅ **Relação one-to-one** entre Property e Address
- ✅ **Campos legacy preservados** para migração gradual sem perda de dados
- ✅ **Duas opções de geolocalização**:
  - **OPÇÃO A**: PostGIS com `GEOGRAPHY(POINT, 4326)` (recomendado para produção)
  - **OPÇÃO B**: Lat/Lng simples com índices otimizados (mais fácil de usar)
- ✅ **Migrações idempotentes** que podem ser executadas múltiplas vezes
- ✅ **Scripts de backfill** para migrar dados antigos
- ✅ **Queries de exemplo** prontas para uso

### 🎯 Benefícios

1. **Busca por proximidade**: Encontre imóveis em um raio de X metros/km
2. **Filtragem hierárquica**: Busque por estado → cidade → região → bairro
3. **SEO otimizado**: URLs estruturadas por localização
4. **Escalabilidade**: Suporta milhões de endereços com índices espaciais
5. **Análise de dados**: Estatísticas por bairro, cidade, etc.

---

## 🚀 Quick Start (3 passos)

### 1️⃣ Validar o Schema

```bash
pnpm prisma validate
```

✅ Deve retornar sem erros.

### 2️⃣ Criar e Aplicar Migração

```bash
# Desenvolvimento (cria e aplica)
pnpm prisma migrate dev --name add_location_hierarchy

# Produção (apenas aplica)
pnpm prisma migrate deploy
```

### 3️⃣ Backfill de Dados Legacy

```bash
# Executa script de migração de dados
psql $DATABASE_URL -f prisma/sql/02_backfill_data.sql
```

✅ **Pronto!** Sua estrutura de localização está configurada.

### 4️⃣ (Opcional) Configurar Geolocalização

**OPÇÃO A: PostGIS (Recomendado para produção)**

```bash
# 1. Instalar PostGIS
psql $DATABASE_URL -f prisma/sql/01_postgis_setup.sql

# 2. Criar índices espaciais
psql $DATABASE_URL -f prisma/sql/02_spatial_indexes.sql

# 3. Atualizar schema.prisma
# Descomente: location Unsupported("geography")? @map("location")
# Comente: lat Float? e lng Float? em Address

# 4. Migrar novamente
pnpm prisma migrate dev --name add_postgis_location
pnpm prisma generate
```

**OPÇÃO B: Lat/Lng Simples (Mais fácil, já configurado)**

```bash
# Apenas criar índices otimizados
psql $DATABASE_URL -f prisma/sql/03_latlng_indexes.sql
```

✅ O schema já está configurado com lat/lng por padrão.

---

## 📂 Estrutura de Arquivos

```
prisma/
├── schema.prisma                    ✅ Schema atualizado
├── migrations/
│   ├── MIGRATION_GUIDE.md          📖 Guia detalhado de migração
│   └── [timestamp]_add_location/   🗃️ Migração gerada automaticamente
├── sql/
│   ├── 01_postgis_setup.sql        🅰️ OPÇÃO A: Configurar PostGIS
│   ├── 02_spatial_indexes.sql      🅰️ OPÇÃO A: Índices espaciais
│   ├── 03_latlng_indexes.sql       🅱️ OPÇÃO B: Índices lat/lng
│   └── 02_backfill_data.sql        📦 Migração de dados legacy
├── examples/
│   ├── 01_basic_queries.ts         📚 Queries básicas com Prisma
│   └── 02_spatial_queries.ts       🗺️ Queries geoespaciais
└── LOCATION_MIGRATION_README.md    📋 Este arquivo
```

---

## 🗄️ Novos Modelos

### State (Estado)

```prisma
model State {
  id        String   @id @default(cuid())
  name      String   // "São Paulo"
  code      String   @unique // "SP"
  cities    City[]
}
```

### City (Cidade)

```prisma
model City {
  id            String         @id @default(cuid())
  name          String         // "São Paulo"
  state         State          @relation(...)
  stateId       String
  neighborhoods Neighborhood[]
}
```

### Region (Região - opcional)

```prisma
model Region {
  id            String         @id @default(cuid())
  name          String         // "Zona Sul"
  isActive      Boolean        @default(false)
  neighborhoods Neighborhood[]
}
```

### Neighborhood (Bairro - refatorado)

```prisma
model Neighborhood {
  id        String    @id @default(cuid())
  slug      String    @unique
  name      String
  // Novas relações
  city      City      @relation(...)
  cityId    String
  region    Region?   @relation(...)
  regionId  String?
  addresses Address[]
  // Campos legacy preservados
  cityLegacy  String? // antigo "city"
  stateLegacy String? // antigo "state"
  // ... outros campos
}
```

### Address (Endereço - refatorado)

```prisma
model Address {
  id             String       @id @default(cuid())
  street         String
  streetNumber   String
  complement     String?
  postalCode     String
  // Nova relação com Neighborhood
  neighborhood   Neighborhood @relation(...)
  neighborhoodId String
  // Geolocalização
  lat            Float?       // OPÇÃO B
  lng            Float?       // OPÇÃO B
  // location    Unsupported("geography")? // OPÇÃO A
  // Relação one-to-one com Property
  property       Property?
  // Campos legacy preservados
  district       String? // @deprecated
  city           String? // @deprecated
  state          String? // @deprecated
  zipcode        String? // @deprecated
}
```

### Property (Imóvel - atualizado)

```prisma
model Property {
  // ...
  address      Address  @relation(...)
  addressId    String   @unique // ⭐ one-to-one
  // ...
}
```

---

## 📊 Diagrama de Relações

```
State (UF)
  └── City (Cidade)
       ├── Neighborhood (Bairro)
       │    ├── Region (opcional)
       │    └── Address (Endereço)
       │         └── Property (Imóvel) [one-to-one]
       └── ...
```

---

## 🔍 Exemplos de Queries

### 1. Buscar imóvel com endereço completo

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const property = await prisma.property.findUnique({
  where: { id: 'property-id' },
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
  },
});

// Resultado:
// property.address.street = "Av. Paulista"
// property.address.neighborhood.name = "Bela Vista"
// property.address.neighborhood.city.name = "São Paulo"
// property.address.neighborhood.city.state.code = "SP"
```

### 2. Listar imóveis por bairro (com paginação)

```typescript
const imoveis = await prisma.property.findMany({
  where: {
    published: true,
    address: {
      neighborhood: {
        slug: 'jardim-paulista',
      },
    },
  },
  include: {
    address: {
      include: {
        neighborhood: true,
      },
    },
  },
  take: 10,
  skip: 0,
});
```

### 3. Buscar imóveis por cidade ou estado

```typescript
const imoveis = await prisma.property.findMany({
  where: {
    published: true,
    address: {
      neighborhood: {
        city: {
          name: 'São Paulo',
          state: {
            code: 'SP',
          },
        },
      },
    },
  },
});
```

### 4. Buscar imóveis próximos (1km de raio)

**OPÇÃO A: PostGIS**

```typescript
const result = await prisma.$queryRaw`
  SELECT 
    p.id, p.title,
    ST_Distance(
      a.location,
      ST_GeogFromText('SRID=4326;POINT(-46.6333 -23.5505)')
    ) as distance_meters
  FROM "Property" p
  INNER JOIN "address" a ON p."addressId" = a.id
  WHERE 
    p.published = true
    AND ST_DWithin(
      a.location,
      ST_GeogFromText('SRID=4326;POINT(-46.6333 -23.5505)'),
      1000
    )
  ORDER BY distance_meters
  LIMIT 20
`;
```

**OPÇÃO B: Haversine (lat/lng)**

```typescript
const lat = -23.5505;
const lng = -46.6333;
const radiusKm = 1;
const latDelta = radiusKm / 111;
const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

const result = await prisma.$queryRaw`
  SELECT 
    p.id, p.title,
    (
      6371000 * acos(
        cos(radians(${lat})) * cos(radians(a.lat)) * 
        cos(radians(a.lng) - radians(${lng})) + 
        sin(radians(${lat})) * sin(radians(a.lat))
      )
    ) as distance_meters
  FROM "Property" p
  INNER JOIN "address" a ON p."addressId" = a.id
  WHERE 
    p.published = true
    AND a.lat BETWEEN ${lat - latDelta} AND ${lat + latDelta}
    AND a.lng BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
  HAVING distance_meters < 1000
  ORDER BY distance_meters
  LIMIT 20
`;
```

### 5. Estatísticas por bairro

```typescript
const stats = await prisma.property.aggregate({
  where: {
    published: true,
    address: {
      neighborhood: {
        slug: 'jardim-paulista',
      },
    },
  },
  _count: true,
  _avg: {
    price: true,
    areaTotal: true,
  },
  _min: {
    price: true,
  },
  _max: {
    price: true,
  },
});
```

📚 **Mais exemplos**: Veja `prisma/examples/` para queries completas.

---

## ✅ Checklist de Validação

### 1. Schema válido

```bash
pnpm prisma validate
```

✅ Sem erros

### 2. Prisma Studio

```bash
pnpm prisma studio
```

- ✅ Todas as tabelas aparecem
- ✅ Relações estão corretas
- ✅ Dados foram migrados

### 3. Verificar relações no banco

```sql
-- Estados e cidades
SELECT 
  s.code, s.name, COUNT(c.id) as total_cities
FROM "state" s
LEFT JOIN "city" c ON c."state_id" = s.id
GROUP BY s.id
ORDER BY s.code;

-- Bairros vinculados
SELECT 
  COUNT(*) as total,
  COUNT("city_id") as com_city,
  COUNT(*) - COUNT("city_id") as sem_city
FROM "neighborhood";

-- Addresses vinculados
SELECT 
  COUNT(*) as total,
  COUNT("neighborhood_id") as com_neighborhood,
  COUNT(*) - COUNT("neighborhood_id") as sem_neighborhood
FROM "address";

-- Relação one-to-one Property-Address
SELECT 
  COUNT(*) as total_properties,
  COUNT(DISTINCT "addressId") as unique_addresses
FROM "Property";
-- ✅ Os números devem ser iguais
```

### 4. Verificar PostGIS (se OPÇÃO A)

```sql
-- Extensão instalada?
SELECT PostGIS_version();

-- Coluna location existe?
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'address' AND column_name = 'location';

-- Índice GIST criado?
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'address' AND indexname = 'idx_address_location';
```

### 5. Verificar índices lat/lng (se OPÇÃO B)

```sql
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'address' 
  AND (indexname LIKE '%lat%' OR indexname LIKE '%lng%');
```

### 6. Testar queries de exemplo

```bash
# Execute os exemplos
cd prisma/examples
npx tsx 01_basic_queries.ts
npx tsx 02_spatial_queries.ts
```

---

## 🔄 Migração de Dados Existentes

O script `prisma/sql/02_backfill_data.sql` faz automaticamente:

1. ✅ Copia valores antigos (`city`, `state` strings) para `city_legacy`, `state_legacy`
2. ✅ Cria estados brasileiros (27 UFs)
3. ✅ Cria cidades baseadas em dados legacy
4. ✅ Vincula neighborhoods às cidades
5. ✅ Cria neighborhood "Não Especificado" para addresses órfãos
6. ✅ Vincula addresses aos neighborhoods
7. ✅ Migra campos antigos para novos (number → streetNumber, zipcode → postalCode)
8. ✅ Verifica integridade referencial

### ⚠️ Importante

- Campos legacy (`district`, `city`, `state`, `zipcode` em Address) são **preservados**
- Você pode removê-los **depois** de garantir que todos os dados foram migrados
- O backfill é **idempotente** - pode ser executado múltiplas vezes

---

## 🚀 Deploy em Produção

### Vercel + Banco Gerenciado (Neon, Supabase, Railway, etc)

#### 1. Aplicar migrações

```bash
# Produção usa migrate deploy (não cria, apenas aplica)
pnpm prisma migrate deploy
```

#### 2. Aplicar SQL extra (PostGIS ou índices)

**Via psql remoto:**

```bash
# OPÇÃO A: PostGIS
psql $DATABASE_URL -f prisma/sql/01_postgis_setup.sql
psql $DATABASE_URL -f prisma/sql/02_spatial_indexes.sql

# OPÇÃO B: Lat/Lng
psql $DATABASE_URL -f prisma/sql/03_latlng_indexes.sql
```

**Ou via dashboard do provedor:**

- Acesse o dashboard do banco (Neon, Supabase, etc)
- Execute os scripts SQL manualmente

#### 3. Backfill de dados

```bash
psql $DATABASE_URL -f prisma/sql/02_backfill_data.sql
```

#### 4. Rebuild na Vercel

```bash
# Push para main dispara rebuild automático
git add .
git commit -m "feat: add location hierarchy"
git push origin main
```

#### 5. Variáveis de ambiente

Certifique-se que `DATABASE_URL` está configurada na Vercel:

```
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
```

---

## 📈 Otimizações de Performance

### Índices criados automaticamente pelo Prisma

- ✅ `State.code` (unique)
- ✅ `City.stateId`
- ✅ `City.name`
- ✅ `Neighborhood.slug` (unique)
- ✅ `Neighborhood.cityId`
- ✅ `Neighborhood.regionId`
- ✅ `Address.neighborhoodId`
- ✅ `Address.lat, lng` (composto)
- ✅ `Property.addressId` (unique)

### Índices espaciais (criados via SQL)

**OPÇÃO A: PostGIS**
- ✅ `idx_address_location` (GIST) - para `ST_DWithin`

**OPÇÃO B: Lat/Lng**
- ✅ `idx_address_lat_lng` (B-Tree composto)
- ✅ `idx_address_lat` (B-Tree)
- ✅ `idx_address_lng` (B-Tree)

### Dicas de otimização

1. **Use sempre índices**: As queries já estão otimizadas para usar índices
2. **Bounding box**: Para Haversine, sempre use bounding box pré-filtro
3. **Limite de resultados**: Use `LIMIT` em queries geoespaciais
4. **Cache**: Cache resultados de buscas por bairro/cidade (ex: Redis)
5. **Prisma Query**: Use `include` apenas quando necessário

---

## 🔧 Troubleshooting

### Erro: "Foreign key constraint fails"

**Causa**: Neighborhoods ou Addresses sem relações configuradas.

**Solução**:
```bash
# Execute o backfill novamente
psql $DATABASE_URL -f prisma/sql/02_backfill_data.sql
```

### Erro: "Column 'location' does not exist"

**Causa**: PostGIS não foi configurado ou coluna não foi criada.

**Solução**:
```bash
# Execute o setup do PostGIS
psql $DATABASE_URL -f prisma/sql/01_postgis_setup.sql
```

### Erro: "Unique constraint violation on addressId"

**Causa**: Múltiplos Properties tentando usar o mesmo Address.

**Solução**: Cada Property deve ter seu próprio Address único.

```typescript
// ❌ ERRADO: Dois properties com mesmo addressId
await prisma.property.create({
  data: { addressId: 'address-1', ... }
});
await prisma.property.create({
  data: { addressId: 'address-1', ... } // ❌ Erro!
});

// ✅ CORRETO: Cada property com address único
await prisma.property.create({
  data: {
    address: {
      create: { ... } // Cria address novo
    },
    ...
  }
});
```

### Erro: "Cannot find module '@prisma/client'"

**Solução**:
```bash
pnpm prisma generate
```

### Performance lenta em buscas geoespaciais

**Soluções**:

1. Verifique se índices foram criados:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'address';
```

2. Use EXPLAIN ANALYZE para ver o plano de query:
```sql
EXPLAIN ANALYZE
SELECT ... -- sua query aqui
```

3. Para PostGIS, garanta que o índice GIST existe:
```bash
psql $DATABASE_URL -f prisma/sql/02_spatial_indexes.sql
```

---

## 📚 Recursos Adicionais

### Documentação

- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [PostGIS Documentation](https://postgis.net/docs/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

### Arquivos de exemplo

- `prisma/examples/01_basic_queries.ts` - Queries básicas
- `prisma/examples/02_spatial_queries.ts` - Queries geoespaciais
- `prisma/migrations/MIGRATION_GUIDE.md` - Guia detalhado

### Scripts úteis

```bash
# Validar schema
pnpm prisma validate

# Abrir Prisma Studio
pnpm prisma studio

# Formatar schema
pnpm prisma format

# Gerar Prisma Client
pnpm prisma generate

# Ver status de migrações
pnpm prisma migrate status

# Resetar banco (⚠️ apaga dados!)
pnpm prisma migrate reset
```

---

## 🎯 Próximos Passos

Após a migração, você pode:

1. ✅ Implementar busca por proximidade no frontend
2. ✅ Criar páginas SEO-friendly por bairro/cidade
3. ✅ Adicionar autocomplete de endereços
4. ✅ Implementar mapas interativos (Google Maps, Mapbox)
5. ✅ Criar dashboard de análise por localização
6. ✅ Popular mais estados/cidades (via API de CEP)
7. ✅ Remover campos legacy após validação completa

---

## 🙏 Suporte

Se encontrar problemas:

1. Verifique o **Checklist de Validação** acima
2. Consulte o **Troubleshooting**
3. Revise os exemplos em `prisma/examples/`
4. Verifique logs do banco de dados

---

## 📝 Changelog

### v1.0.0 - Migração Inicial

- ✅ Adicionados modelos State, City, Region
- ✅ Refatorado Neighborhood com relações hierárquicas
- ✅ Refatorado Address com relação one-to-one a Property
- ✅ Campos legacy preservados para compatibilidade
- ✅ Suporte a PostGIS (OPÇÃO A) e Lat/Lng (OPÇÃO B)
- ✅ Migrações e backfill idempotentes
- ✅ Queries de exemplo completas
- ✅ Documentação completa

---

**🎉 Migração completa! Agora você tem uma estrutura de localização robusta e escalável.**


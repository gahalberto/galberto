# ✅ Checklist de Validação - Migração de Localização

Execute este checklist passo a passo após aplicar a migração.

---

## 🟢 FASE 1: Validação Básica

### ☐ 1.1. Schema Prisma é válido

```bash
pnpm prisma validate
```

**Resultado esperado**: 
```
✅ The schema at prisma/schema.prisma is valid.
```

---

### ☐ 1.2. Prisma Client regenerado

```bash
pnpm prisma generate
```

**Resultado esperado**:
```
✔ Generated Prisma Client ...
```

---

### ☐ 1.3. Prisma Studio abre

```bash
pnpm prisma studio
```

**Resultado esperado**:
- ✅ Abre em http://localhost:5555
- ✅ Todas as tabelas aparecem:
  - State
  - City
  - Region
  - Neighborhood (atualizado)
  - Address (atualizado)
  - Property (atualizado)

---

## 🟡 FASE 2: Verificação de Dados

### ☐ 2.1. Estados foram criados

```sql
SELECT COUNT(*) as total_estados FROM "state";
```

**Resultado esperado**: `27` (estados brasileiros)

```sql
SELECT code, name FROM "state" ORDER BY code LIMIT 5;
```

**Resultado esperado**:
```
 code |    name
------+-----------
 AC   | Acre
 AL   | Alagoas
 AM   | Amazonas
 AP   | Amapá
 BA   | Bahia
```

---

### ☐ 2.2. Cidades foram criadas/vinculadas

```sql
SELECT 
  s.code, 
  s.name as estado, 
  COUNT(c.id) as total_cidades
FROM "state" s
LEFT JOIN "city" c ON c."state_id" = s.id
GROUP BY s.id, s.code, s.name
ORDER BY total_cidades DESC
LIMIT 10;
```

**Resultado esperado**: Lista de estados com suas cidades vinculadas.

---

### ☐ 2.3. Neighborhoods têm city_id preenchido

```sql
SELECT 
  COUNT(*) as total_neighborhoods,
  COUNT("city_id") as com_city_id,
  COUNT(*) - COUNT("city_id") as sem_city_id
FROM "neighborhood";
```

**Resultado esperado**: 
- `sem_city_id` deve ser **0** (ou próximo de 0)

---

### ☐ 2.4. Campos legacy foram preservados

```sql
SELECT 
  id, 
  name, 
  city_legacy, 
  state_legacy, 
  "city_id"
FROM "neighborhood"
WHERE city_legacy IS NOT NULL
LIMIT 5;
```

**Resultado esperado**: Deve mostrar valores em `city_legacy` e `state_legacy`.

---

### ☐ 2.5. Addresses têm neighborhood_id preenchido

```sql
SELECT 
  COUNT(*) as total_addresses,
  COUNT("neighborhood_id") as com_neighborhood_id,
  COUNT(*) - COUNT("neighborhood_id") as sem_neighborhood_id
FROM "address";
```

**Resultado esperado**:
- `sem_neighborhood_id` deve ser **0**

---

### ☐ 2.6. Campos de Address foram migrados

```sql
SELECT 
  id,
  street,
  street_number,
  postal_code,
  neighborhood_id,
  -- Campos legacy (devem estar preenchidos)
  district,
  zipcode
FROM "address"
LIMIT 5;
```

**Resultado esperado**:
- `street_number` e `postal_code` preenchidos
- `district` e `zipcode` preservados (legacy)

---

## 🔵 FASE 3: Validação de Relações

### ☐ 3.1. Relação State → City

```sql
SELECT 
  s.name as estado,
  COUNT(c.id) as total_cidades
FROM "state" s
LEFT JOIN "city" c ON c."state_id" = s.id
GROUP BY s.name
HAVING COUNT(c.id) > 0
ORDER BY total_cidades DESC
LIMIT 5;
```

**Resultado esperado**: Estados com suas cidades.

---

### ☐ 3.2. Relação City → Neighborhood

```sql
SELECT 
  c.name as cidade,
  s.code as uf,
  COUNT(n.id) as total_bairros
FROM "city" c
INNER JOIN "state" s ON c."state_id" = s.id
LEFT JOIN "neighborhood" n ON n."city_id" = c.id
GROUP BY c.name, s.code
HAVING COUNT(n.id) > 0
ORDER BY total_bairros DESC
LIMIT 5;
```

**Resultado esperado**: Cidades com seus bairros.

---

### ☐ 3.3. Relação Neighborhood → Address

```sql
SELECT 
  n.name as bairro,
  c.name as cidade,
  COUNT(a.id) as total_enderecos
FROM "neighborhood" n
INNER JOIN "city" c ON n."city_id" = c.id
LEFT JOIN "address" a ON a."neighborhood_id" = n.id
GROUP BY n.name, c.name
HAVING COUNT(a.id) > 0
ORDER BY total_enderecos DESC
LIMIT 5;
```

**Resultado esperado**: Bairros com seus endereços.

---

### ☐ 3.4. Relação one-to-one Property → Address

```sql
SELECT 
  COUNT(*) as total_properties,
  COUNT(DISTINCT "addressId") as unique_addresses
FROM "Property";
```

**Resultado esperado**: 
- ✅ `total_properties` = `unique_addresses` (relação one-to-one)

```sql
-- Verificar se algum addressId está duplicado (não deveria haver)
SELECT 
  "addressId", 
  COUNT(*) as count
FROM "Property"
GROUP BY "addressId"
HAVING COUNT(*) > 1;
```

**Resultado esperado**: **0 linhas** (nenhum duplicado)

---

### ☐ 3.5. Integridade referencial completa

```sql
-- Properties sem Address (não deveria haver)
SELECT COUNT(*) as properties_sem_address
FROM "Property"
WHERE "addressId" IS NULL;
```

**Resultado esperado**: `0`

```sql
-- Addresses sem Neighborhood (não deveria haver)
SELECT COUNT(*) as addresses_sem_neighborhood
FROM "address"
WHERE "neighborhood_id" IS NULL;
```

**Resultado esperado**: `0`

```sql
-- Neighborhoods sem City (não deveria haver)
SELECT COUNT(*) as neighborhoods_sem_city
FROM "neighborhood"
WHERE "city_id" IS NULL;
```

**Resultado esperado**: `0`

---

## 🟣 FASE 4: Validação de Geolocalização

### ☐ 4.1. Coordenadas foram preservadas/migradas

```sql
SELECT 
  COUNT(*) as total_addresses,
  COUNT(lat) as com_latitude,
  COUNT(lng) as com_longitude,
  COUNT(*) FILTER (WHERE lat IS NOT NULL AND lng IS NOT NULL) as com_coordenadas_completas
FROM "address";
```

**Resultado esperado**: Endereços com coordenadas.

---

### ☐ 4.2. Índices lat/lng foram criados (OPÇÃO B)

```sql
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'address' 
  AND (indexname LIKE '%lat%' OR indexname LIKE '%lng%')
ORDER BY indexname;
```

**Resultado esperado**:
```
idx_address_lat
idx_address_lat_lng
idx_address_lng
```

---

### ☐ 4.3. PostGIS instalado (OPÇÃO A - se escolheu)

```sql
SELECT PostGIS_version();
```

**Resultado esperado**: Versão do PostGIS (ex: `3.4 USE_GEOS=1 ...`)

---

### ☐ 4.4. Coluna location existe (OPÇÃO A - se escolheu)

```sql
SELECT 
  column_name, 
  data_type,
  udt_name
FROM information_schema.columns 
WHERE table_name = 'address' 
  AND column_name = 'location';
```

**Resultado esperado**:
```
column_name | data_type | udt_name
------------+-----------+----------
location    | USER-DEFINED | geography
```

---

### ☐ 4.5. Índice GIST criado (OPÇÃO A - se escolheu)

```sql
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'address' 
  AND indexname = 'idx_address_location';
```

**Resultado esperado**:
```
idx_address_location | CREATE INDEX idx_address_location ON public.address USING gist (location)
```

---

### ☐ 4.6. Dados de location foram backfilled (OPÇÃO A)

```sql
SELECT 
  COUNT(*) as total_addresses,
  COUNT(location) as com_location,
  COUNT(lat) as com_lat,
  COUNT(lng) as com_lng
FROM "address";
```

**Resultado esperado**: `com_location` deve ser igual ou próximo a `com_lat` e `com_lng`.

---

## 🟠 FASE 5: Testes de Queries

### ☐ 5.1. Query de imóvel com endereço completo

```typescript
const property = await prisma.property.findFirst({
  where: { published: true },
  include: {
    address: {
      include: {
        neighborhood: {
          include: {
            city: {
              include: { state: true }
            },
            region: true
          }
        }
      }
    }
  }
});

console.log(property?.address?.neighborhood?.city?.state?.code);
```

**Resultado esperado**: Código do estado (ex: `SP`)

---

### ☐ 5.2. Query de imóveis por bairro

```typescript
const imoveis = await prisma.property.findMany({
  where: {
    address: {
      neighborhood: {
        slug: 'jardim-paulista' // ajuste para um slug real
      }
    }
  },
  take: 5
});

console.log(`${imoveis.length} imóveis encontrados`);
```

**Resultado esperado**: Lista de imóveis do bairro.

---

### ☐ 5.3. Query de imóveis por cidade

```typescript
const imoveis = await prisma.property.findMany({
  where: {
    address: {
      neighborhood: {
        city: {
          name: { contains: 'São Paulo' }
        }
      }
    }
  },
  take: 10
});

console.log(`${imoveis.length} imóveis em São Paulo`);
```

**Resultado esperado**: Lista de imóveis da cidade.

---

### ☐ 5.4. Query de busca por proximidade (Haversine - OPÇÃO B)

```typescript
const lat = -23.5505;
const lng = -46.6333;
const radiusKm = 1;

const result = await prisma.$queryRaw`
  SELECT 
    p.id, p.title,
    (
      6371 * acos(
        cos(radians(${lat})) * cos(radians(a.lat)) * 
        cos(radians(a.lng) - radians(${lng})) + 
        sin(radians(${lat})) * sin(radians(a.lat))
      )
    ) as distance_km
  FROM "Property" p
  INNER JOIN "address" a ON p."addressId" = a.id
  WHERE 
    a.lat IS NOT NULL AND a.lng IS NOT NULL
  HAVING distance_km < ${radiusKm}
  ORDER BY distance_km
  LIMIT 5
`;

console.log(`${result.length} imóveis próximos`);
```

**Resultado esperado**: Lista de imóveis próximos ao ponto.

---

### ☐ 5.5. Query de busca por proximidade (PostGIS - OPÇÃO A)

```typescript
const result = await prisma.$queryRaw`
  SELECT 
    p.id, p.title,
    ST_Distance(
      a.location,
      ST_GeogFromText('SRID=4326;POINT(-46.6333 -23.5505)')
    ) / 1000 as distance_km
  FROM "Property" p
  INNER JOIN "address" a ON p."addressId" = a.id
  WHERE 
    ST_DWithin(
      a.location,
      ST_GeogFromText('SRID=4326;POINT(-46.6333 -23.5505)'),
      1000
    )
  ORDER BY distance_km
  LIMIT 5
`;

console.log(`${result.length} imóveis próximos (PostGIS)`);
```

**Resultado esperado**: Lista de imóveis próximos usando PostGIS.

---

### ☐ 5.6. Estatísticas por bairro

```typescript
const stats = await prisma.property.aggregate({
  where: {
    address: {
      neighborhood: {
        slug: 'jardim-paulista' // ajuste para um slug real
      }
    }
  },
  _count: true,
  _avg: { price: true },
  _min: { price: true },
  _max: { price: true }
});

console.log(`Total: ${stats._count}`);
console.log(`Preço médio: ${stats._avg.price}`);
```

**Resultado esperado**: Estatísticas do bairro.

---

## 🔴 FASE 6: Performance

### ☐ 6.1. Verificar plano de execução de query por bairro

```sql
EXPLAIN ANALYZE
SELECT p.*
FROM "Property" p
INNER JOIN "address" a ON p."addressId" = a.id
INNER JOIN "neighborhood" n ON a."neighborhood_id" = n.id
WHERE n.slug = 'jardim-paulista'
LIMIT 10;
```

**Resultado esperado**: 
- ✅ Deve usar **Index Scan** em `neighborhood.slug` (unique)
- ✅ Deve usar **Index Scan** em `address.neighborhood_id`
- ⚠️ Se usar **Seq Scan**, pode indicar problema

---

### ☐ 6.2. Verificar performance de busca por proximidade

```sql
EXPLAIN ANALYZE
SELECT 
  p.id, p.title,
  (
    6371000 * acos(
      cos(radians(-23.5505)) * cos(radians(a.lat)) * 
      cos(radians(a.lng) - radians(-46.6333)) + 
      sin(radians(-23.5505)) * sin(radians(a.lat))
    )
  ) as distance_meters
FROM "Property" p
INNER JOIN "address" a ON p."addressId" = a.id
WHERE 
  a.lat BETWEEN -23.56 AND -23.54
  AND a.lng BETWEEN -46.64 AND -46.62
LIMIT 10;
```

**Resultado esperado**:
- ✅ Deve usar **Index Scan** em `idx_address_lat_lng`
- ✅ Execution time < 100ms (para até 10k registros)

---

### ☐ 6.3. Verificar tamanho dos índices

```sql
SELECT 
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_indexes
WHERE tablename IN ('state', 'city', 'neighborhood', 'address', 'Property')
ORDER BY pg_relation_size(indexname::regclass) DESC;
```

**Resultado esperado**: Lista de índices e seus tamanhos.

---

## ✅ FASE 7: Checklist Final

### ☐ 7.1. Todos os modelos estão no Prisma Studio
- [ ] State
- [ ] City
- [ ] Region
- [ ] Neighborhood
- [ ] Address
- [ ] Property

---

### ☐ 7.2. Todas as relações funcionam
- [ ] State → City
- [ ] City → Neighborhood
- [ ] Region → Neighborhood (opcional)
- [ ] Neighborhood → Address
- [ ] Address → Property (one-to-one)

---

### ☐ 7.3. Dados legacy preservados
- [ ] `neighborhood.city_legacy` preenchido
- [ ] `neighborhood.state_legacy` preenchido
- [ ] `address.district` preservado
- [ ] `address.city` preservado
- [ ] `address.state` preservado
- [ ] `address.zipcode` preservado

---

### ☐ 7.4. Geolocalização configurada
- [ ] **OPÇÃO A**: PostGIS instalado e funcionando
- [ ] **OPÇÃO A**: Coluna `location` existe
- [ ] **OPÇÃO A**: Índice GIST criado
- [ ] **OPÇÃO B**: Campos `lat` e `lng` existem
- [ ] **OPÇÃO B**: Índices `lat`/`lng` criados

---

### ☐ 7.5. Queries de exemplo funcionam
- [ ] Busca por bairro
- [ ] Busca por cidade
- [ ] Busca por estado
- [ ] Busca por proximidade
- [ ] Estatísticas por bairro
- [ ] Imóvel com endereço completo

---

### ☐ 7.6. Performance está adequada
- [ ] Queries usam índices (verificar com EXPLAIN)
- [ ] Tempo de resposta < 100ms para queries simples
- [ ] Tempo de resposta < 500ms para queries geoespaciais

---

### ☐ 7.7. Aplicação funciona end-to-end
- [ ] Frontend lista imóveis por bairro
- [ ] Filtros por localização funcionam
- [ ] Busca por proximidade funciona
- [ ] Páginas de bairro carregam corretamente

---

## 📊 Relatório Final

Após completar o checklist, execute:

```sql
-- Relatório de dados
SELECT 
  'States' as tabela, COUNT(*) as total FROM "state"
UNION ALL
SELECT 'Cities', COUNT(*) FROM "city"
UNION ALL
SELECT 'Regions', COUNT(*) FROM "region"
UNION ALL
SELECT 'Neighborhoods', COUNT(*) FROM "neighborhood"
UNION ALL
SELECT 'Addresses', COUNT(*) FROM "address"
UNION ALL
SELECT 'Properties', COUNT(*) FROM "Property"
ORDER BY tabela;
```

**Anote os números** para referência futura.

---

## 🎉 Sucesso!

Se todos os itens estão marcados, sua migração está completa e funcional!

### Próximos passos:

1. ✅ Implementar features usando a nova estrutura
2. ✅ Monitorar performance em produção
3. ✅ Gradualmente remover campos legacy (após 100% de migração)
4. ✅ Popular mais dados (estados, cidades, bairros)

---

**Data da validação**: ___________  
**Validado por**: ___________  
**Ambiente**: [ ] Desenvolvimento [ ] Staging [ ] Produção


-- ============================================================================
-- Script de Backfill - Migração de Dados Legacy
-- ============================================================================
-- Este script migra dados dos campos antigos para a nova estrutura hierárquica
-- Execute após a migração principal do Prisma

-- ============================================================================
-- 1. Backup de Dados Legacy em Neighborhood
-- ============================================================================
-- Copia valores antigos de city/state (strings) para city_legacy/state_legacy

UPDATE "neighborhood"
SET 
    "city_legacy" = "city",
    "state_legacy" = "state"
WHERE "city_legacy" IS NULL 
  AND ("city" IS NOT NULL OR "state" IS NOT NULL);

SELECT COUNT(*) as neighborhoods_com_legacy 
FROM "neighborhood" 
WHERE "city_legacy" IS NOT NULL;

-- ============================================================================
-- 2. Popular Estados Brasileiros (se não existirem)
-- ============================================================================
-- Cria registros básicos de estados se ainda não existirem

INSERT INTO "state" (id, name, code, "createdAt", "updatedAt")
VALUES
    (gen_random_uuid()::text, 'São Paulo', 'SP', NOW(), NOW()),
    (gen_random_uuid()::text, 'Rio de Janeiro', 'RJ', NOW(), NOW()),
    (gen_random_uuid()::text, 'Minas Gerais', 'MG', NOW(), NOW()),
    (gen_random_uuid()::text, 'Bahia', 'BA', NOW(), NOW()),
    (gen_random_uuid()::text, 'Paraná', 'PR', NOW(), NOW()),
    (gen_random_uuid()::text, 'Rio Grande do Sul', 'RS', NOW(), NOW()),
    (gen_random_uuid()::text, 'Santa Catarina', 'SC', NOW(), NOW()),
    (gen_random_uuid()::text, 'Goiás', 'GO', NOW(), NOW()),
    (gen_random_uuid()::text, 'Pernambuco', 'PE', NOW(), NOW()),
    (gen_random_uuid()::text, 'Ceará', 'CE', NOW(), NOW()),
    (gen_random_uuid()::text, 'Pará', 'PA', NOW(), NOW()),
    (gen_random_uuid()::text, 'Maranhão', 'MA', NOW(), NOW()),
    (gen_random_uuid()::text, 'Distrito Federal', 'DF', NOW(), NOW()),
    (gen_random_uuid()::text, 'Amazonas', 'AM', NOW(), NOW()),
    (gen_random_uuid()::text, 'Espírito Santo', 'ES', NOW(), NOW()),
    (gen_random_uuid()::text, 'Mato Grosso', 'MT', NOW(), NOW()),
    (gen_random_uuid()::text, 'Mato Grosso do Sul', 'MS', NOW(), NOW()),
    (gen_random_uuid()::text, 'Paraíba', 'PB', NOW(), NOW()),
    (gen_random_uuid()::text, 'Rio Grande do Norte', 'RN', NOW(), NOW()),
    (gen_random_uuid()::text, 'Alagoas', 'AL', NOW(), NOW()),
    (gen_random_uuid()::text, 'Piauí', 'PI', NOW(), NOW()),
    (gen_random_uuid()::text, 'Sergipe', 'SE', NOW(), NOW()),
    (gen_random_uuid()::text, 'Rondônia', 'RO', NOW(), NOW()),
    (gen_random_uuid()::text, 'Tocantins', 'TO', NOW(), NOW()),
    (gen_random_uuid()::text, 'Acre', 'AC', NOW(), NOW()),
    (gen_random_uuid()::text, 'Amapá', 'AP', NOW(), NOW()),
    (gen_random_uuid()::text, 'Roraima', 'RR', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

SELECT COUNT(*) as total_estados FROM "state";

-- ============================================================================
-- 3. Popular Cidades Baseadas em Dados Legacy de Neighborhood
-- ============================================================================
-- Cria registros de City baseados nos valores únicos de city_legacy

-- Para cada combinação única de (city_legacy, state_legacy), cria uma City
INSERT INTO "city" (id, name, "state_id", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    DISTINCT ON (n."city_legacy", n."state_legacy") n."city_legacy",
    s.id,
    NOW(),
    NOW()
FROM "neighborhood" n
INNER JOIN "state" s ON s.code = n."state_legacy"
WHERE n."city_legacy" IS NOT NULL 
  AND n."state_legacy" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "city" c 
    WHERE c.name = n."city_legacy" 
    AND c."state_id" = s.id
  )
GROUP BY n."city_legacy", n."state_legacy", s.id;

SELECT COUNT(*) as total_cidades FROM "city";

-- ============================================================================
-- 4. Vincular Neighborhoods às Cidades
-- ============================================================================
-- Atualiza city_id em Neighborhood baseado em city_legacy e state_legacy

UPDATE "neighborhood" n
SET "city_id" = c.id
FROM "city" c
INNER JOIN "state" s ON c."state_id" = s.id
WHERE n."city_legacy" = c.name
  AND n."state_legacy" = s.code
  AND n."city_id" IS NULL;

-- Verificar quantos neighborhoods foram vinculados
SELECT 
    COUNT(*) as total_neighborhoods,
    COUNT("city_id") as com_city_id,
    COUNT(*) - COUNT("city_id") as sem_city_id
FROM "neighborhood";

-- ============================================================================
-- 5. Criar Neighborhood "Não Especificado" para Addresses Órfãos
-- ============================================================================
-- Para addresses que não têm um bairro definido, cria um neighborhood padrão

DO $$
DECLARE
    default_state_id TEXT;
    default_city_id TEXT;
    default_neighborhood_id TEXT;
BEGIN
    -- Pegar o primeiro estado (ou criar um genérico)
    SELECT id INTO default_state_id FROM "state" LIMIT 1;
    
    IF default_state_id IS NULL THEN
        INSERT INTO "state" (id, name, code, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, 'Não Especificado', 'XX', NOW(), NOW())
        RETURNING id INTO default_state_id;
    END IF;
    
    -- Pegar ou criar cidade padrão
    SELECT id INTO default_city_id 
    FROM "city" 
    WHERE name = 'Não Especificado' 
    LIMIT 1;
    
    IF default_city_id IS NULL THEN
        INSERT INTO "city" (id, name, "state_id", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, 'Não Especificado', default_state_id, NOW(), NOW())
        RETURNING id INTO default_city_id;
    END IF;
    
    -- Pegar ou criar neighborhood padrão
    SELECT id INTO default_neighborhood_id 
    FROM "neighborhood" 
    WHERE slug = 'nao-especificado' 
    LIMIT 1;
    
    IF default_neighborhood_id IS NULL THEN
        INSERT INTO "neighborhood" (id, slug, name, "city_id", published, "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid()::text, 
            'nao-especificado', 
            'Não Especificado', 
            default_city_id, 
            false, 
            NOW(), 
            NOW()
        )
        RETURNING id INTO default_neighborhood_id;
    END IF;
    
    RAISE NOTICE 'Neighborhood padrão criado/encontrado: %', default_neighborhood_id;
END $$;

-- ============================================================================
-- 6. Migrar Dados de Address
-- ============================================================================
-- Preserva dados antigos e vincula ao neighborhood apropriado

-- Primeiro, tenta vincular addresses existentes aos neighborhoods por nome (district)
UPDATE "address" a
SET "neighborhood_id" = n.id
FROM "neighborhood" n
WHERE LOWER(a.district) = LOWER(n.name)
  AND a."neighborhood_id" IS NULL
  AND a.district IS NOT NULL;

-- Para addresses sem neighborhood_id, usa o padrão
UPDATE "address" a
SET "neighborhood_id" = n.id
FROM "neighborhood" n
WHERE n.slug = 'nao-especificado'
  AND a."neighborhood_id" IS NULL;

-- Mapear campos antigos para novos (se ainda não mapeados)
UPDATE "address"
SET 
    "street_number" = COALESCE("street_number", "number"),
    "postal_code" = COALESCE("postal_code", "zipcode")
WHERE "street_number" IS NULL OR "postal_code" IS NULL;

-- Verificar resultados
SELECT 
    COUNT(*) as total_addresses,
    COUNT("neighborhood_id") as com_neighborhood,
    COUNT(lat) as com_lat,
    COUNT(lng) as com_lng,
    COUNT(*) FILTER (WHERE lat IS NOT NULL AND lng IS NOT NULL) as com_coordenadas
FROM "address";

-- ============================================================================
-- 7. Verificar Integridade Referencial
-- ============================================================================

-- Addresses sem neighborhood (não deveria haver após backfill)
SELECT COUNT(*) as addresses_sem_neighborhood
FROM "address"
WHERE "neighborhood_id" IS NULL;

-- Neighborhoods sem city (problema!)
SELECT COUNT(*) as neighborhoods_sem_city
FROM "neighborhood"
WHERE "city_id" IS NULL;

-- Properties com addressId duplicado (problema - viola one-to-one)
SELECT "addressId", COUNT(*) as count
FROM "Property"
GROUP BY "addressId"
HAVING COUNT(*) > 1;

-- ============================================================================
-- 8. Relatório Final
-- ============================================================================

SELECT 
    'States' as tabela,
    COUNT(*) as total
FROM "state"
UNION ALL
SELECT 
    'Cities' as tabela,
    COUNT(*) as total
FROM "city"
UNION ALL
SELECT 
    'Regions' as tabela,
    COUNT(*) as total
FROM "region"
UNION ALL
SELECT 
    'Neighborhoods' as tabela,
    COUNT(*) as total
FROM "neighborhood"
UNION ALL
SELECT 
    'Addresses' as tabela,
    COUNT(*) as total
FROM "address"
UNION ALL
SELECT 
    'Properties' as tabela,
    COUNT(*) as total
FROM "Property"
ORDER BY tabela;

-- ============================================================================
-- FIM DO BACKFILL
-- ============================================================================


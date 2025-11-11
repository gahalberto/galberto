-- ============================================================================
-- OPÇÃO B: Índices para Lat/Lng Simples (sem PostGIS)
-- ============================================================================
-- Cria índices otimizados para buscas por latitude/longitude
-- Execute se escolheu OPÇÃO B (sem PostGIS)

-- Criar índice composto em (lat, lng) - já está no schema, mas criando explicitamente
-- Este índice já é criado automaticamente pelo Prisma através de @@index([lat, lng])
-- mas incluímos aqui para referência e customização se necessário

-- Verificar índices existentes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'address' 
  AND (indexname LIKE '%lat%' OR indexname LIKE '%lng%');

-- Índices adicionais úteis para performance
DO $$ 
BEGIN
    -- Índice individual em lat (para queries que filtram apenas latitude)
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'address' 
        AND indexname = 'idx_address_lat'
    ) THEN
        CREATE INDEX "idx_address_lat" ON "address" ("lat")
        WHERE "lat" IS NOT NULL;
        
        RAISE NOTICE 'Índice idx_address_lat criado';
    END IF;

    -- Índice individual em lng (para queries que filtram apenas longitude)
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'address' 
        AND indexname = 'idx_address_lng'
    ) THEN
        CREATE INDEX "idx_address_lng" ON "address" ("lng")
        WHERE "lng" IS NOT NULL;
        
        RAISE NOTICE 'Índice idx_address_lng criado';
    END IF;
END $$;

-- Estatísticas dos dados geoespaciais
SELECT 
    COUNT(*) as total_enderecos,
    COUNT(lat) as com_latitude,
    COUNT(lng) as com_longitude,
    COUNT(*) FILTER (WHERE lat IS NOT NULL AND lng IS NOT NULL) as com_coordenadas_completas
FROM "address";

-- Exemplo de query Haversine para busca por raio (1km)
-- (descomente para testar - ajuste as coordenadas)

/*
WITH target AS (
    SELECT -23.5505 as target_lat, -46.6333 as target_lng -- São Paulo centro
)
SELECT 
    a.id,
    a.street,
    a.lat,
    a.lng,
    -- Fórmula Haversine para calcular distância em metros
    (
        6371000 * acos(
            cos(radians(t.target_lat)) * 
            cos(radians(a.lat)) * 
            cos(radians(a.lng) - radians(t.target_lng)) + 
            sin(radians(t.target_lat)) * 
            sin(radians(a.lat))
        )
    ) as distance_meters
FROM "address" a
CROSS JOIN target t
WHERE a.lat IS NOT NULL 
  AND a.lng IS NOT NULL
  -- Bounding box pré-filtro (muito mais rápido)
  AND a.lat BETWEEN (t.target_lat - 0.01) AND (t.target_lat + 0.01)
  AND a.lng BETWEEN (t.target_lng - 0.01) AND (t.target_lng + 0.01)
HAVING (
    6371000 * acos(
        cos(radians(t.target_lat)) * 
        cos(radians(a.lat)) * 
        cos(radians(a.lng) - radians(t.target_lng)) + 
        sin(radians(t.target_lat)) * 
        sin(radians(a.lat))
    )
) < 1000 -- 1km
ORDER BY distance_meters
LIMIT 10;
*/

COMMENT ON COLUMN "address"."lat" IS 'Latitude em graus decimais (WGS 84)';
COMMENT ON COLUMN "address"."lng" IS 'Longitude em graus decimais (WGS 84)';


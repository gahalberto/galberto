-- ============================================================================
-- OPÇÃO A: Índices Espaciais com PostGIS
-- ============================================================================
-- Cria índice GIST para buscas geoespaciais rápidas
-- Execute apenas se escolheu OPÇÃO A (PostGIS)

-- Criar índice GIST na coluna location (idempotente)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'address' 
        AND indexname = 'idx_address_location'
    ) THEN
        CREATE INDEX "idx_address_location" 
        ON "address" 
        USING GIST ("location");
        
        RAISE NOTICE 'Índice espacial idx_address_location criado com sucesso';
    ELSE
        RAISE NOTICE 'Índice idx_address_location já existe';
    END IF;
END $$;

-- Verificar índice criado
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'address' 
  AND indexname = 'idx_address_location';

-- Exemplo de query usando o índice espacial
-- Encontrar endereços em um raio de 1km de um ponto
-- (descomente para testar - ajuste as coordenadas)

/*
EXPLAIN ANALYZE
SELECT 
    id,
    street,
    ST_Distance("location", ST_GeogFromText('SRID=4326;POINT(-46.6333 -23.5505)')) as distance_meters
FROM "address"
WHERE ST_DWithin(
    "location",
    ST_GeogFromText('SRID=4326;POINT(-46.6333 -23.5505)'), -- São Paulo centro
    1000 -- 1km em metros
)
ORDER BY distance_meters
LIMIT 10;
*/

COMMENT ON INDEX "idx_address_location" IS 'Índice espacial GIST para buscas geoespaciais rápidas com PostGIS';


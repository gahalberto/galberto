-- ============================================================================
-- OPÇÃO A: Configuração do PostGIS
-- ============================================================================
-- Este script instala e configura o PostGIS para geolocalização avançada
-- Execute apenas se quiser usar PostGIS (geography) em vez de lat/lng simples

-- Habilitar extensão PostGIS (idempotente)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verificar versão instalada
SELECT PostGIS_version();

-- Adicionar coluna location na tabela address (idempotente)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'address' AND column_name = 'location'
    ) THEN
        ALTER TABLE "address" 
        ADD COLUMN "location" GEOGRAPHY(POINT, 4326);
        
        RAISE NOTICE 'Coluna location criada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna location já existe';
    END IF;
END $$;

-- Backfill: popular location a partir de lat/lng existentes (se houver)
UPDATE "address"
SET "location" = ST_GeogFromText('SRID=4326;POINT(' || lng || ' ' || lat || ')')
WHERE lat IS NOT NULL 
  AND lng IS NOT NULL 
  AND "location" IS NULL;

-- Verificar quantos registros foram atualizados
SELECT COUNT(*) as total_com_location 
FROM "address" 
WHERE "location" IS NOT NULL;

COMMENT ON COLUMN "address"."location" IS 'Geolocalização em formato PostGIS GEOGRAPHY(POINT, 4326) - WGS 84';


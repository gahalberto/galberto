-- ============================================================================
-- Script para criar tabelas State, City e Region
-- ============================================================================
-- Execute este script ANTES de inserir os dados via SQL
-- Este script cria apenas as tabelas, sem dados

-- Criar tabela state (estados)
CREATE TABLE IF NOT EXISTS "state" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- Criar índice único em code
CREATE UNIQUE INDEX IF NOT EXISTS "state_code_key" ON "state"("code");

-- Criar tabela city (cidades)
CREATE TABLE IF NOT EXISTS "city" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- Criar índices em city
CREATE INDEX IF NOT EXISTS "city_state_id_idx" ON "city"("state_id");
CREATE INDEX IF NOT EXISTS "city_name_idx" ON "city"("name");

-- Criar foreign key de city para state
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'city_state_id_fkey'
    ) THEN
        ALTER TABLE "city" 
        ADD CONSTRAINT "city_state_id_fkey" 
        FOREIGN KEY ("state_id") 
        REFERENCES "state"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Criar tabela region (regiões)
CREATE TABLE IF NOT EXISTS "region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- Criar índice em region.name
CREATE INDEX IF NOT EXISTS "region_name_idx" ON "region"("name");

-- Verificar se as tabelas foram criadas
SELECT 
    'state' as tabela,
    COUNT(*) as total_registros
FROM "state"
UNION ALL
SELECT 
    'city' as tabela,
    COUNT(*) as total_registros
FROM "city"
UNION ALL
SELECT 
    'region' as tabela,
    COUNT(*) as total_registros
FROM "region"
ORDER BY tabela;

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '✅ Tabelas state, city e region criadas com sucesso!';
    RAISE NOTICE '📝 Agora você pode inserir os dados via SQL';
END $$;


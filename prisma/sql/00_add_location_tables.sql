-- ============================================================================
-- Migração incremental: Adiciona tabelas State, City, Region
-- e atualiza Neighborhood e Address com novas colunas
-- ============================================================================
-- Este script é idempotente e não remove dados existentes

-- 1. Criar tabela state (se não existir)
CREATE TABLE IF NOT EXISTS "state" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "state_code_key" ON "state"("code");

-- 2. Criar tabela city (se não existir)
CREATE TABLE IF NOT EXISTS "city" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "city_state_id_idx" ON "city"("state_id");
CREATE INDEX IF NOT EXISTS "city_name_idx" ON "city"("name");

-- Adicionar foreign key de city para state (se não existir)
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

-- 3. Criar tabela region (se não existir)
CREATE TABLE IF NOT EXISTS "region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "region_name_idx" ON "region"("name");

-- 4. Atualizar tabela neighborhood: adicionar colunas city_id e region_id (se não existirem)
DO $$ 
BEGIN
    -- Adicionar city_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'neighborhood' AND column_name = 'city_id'
    ) THEN
        ALTER TABLE "neighborhood" ADD COLUMN "city_id" TEXT;
        RAISE NOTICE 'Coluna "city_id" adicionada à tabela "neighborhood"';
    END IF;

    -- Adicionar region_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'neighborhood' AND column_name = 'region_id'
    ) THEN
        ALTER TABLE "neighborhood" ADD COLUMN "region_id" TEXT;
        RAISE NOTICE 'Coluna "region_id" adicionada à tabela "neighborhood"';
    END IF;

    -- Adicionar city_legacy se não existir (para preservar dados antigos)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'neighborhood' AND column_name = 'city_legacy'
    ) THEN
        ALTER TABLE "neighborhood" ADD COLUMN "city_legacy" TEXT;
        -- Copiar dados do campo "city" antigo para city_legacy
        UPDATE "neighborhood" SET "city_legacy" = "city" WHERE "city_legacy" IS NULL;
        RAISE NOTICE 'Coluna "city_legacy" adicionada e preenchida';
    END IF;

    -- Adicionar state_legacy se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'neighborhood' AND column_name = 'state_legacy'
    ) THEN
        ALTER TABLE "neighborhood" ADD COLUMN "state_legacy" TEXT;
        -- Copiar dados do campo "state" antigo para state_legacy
        UPDATE "neighborhood" SET "state_legacy" = "state" WHERE "state_legacy" IS NULL;
        RAISE NOTICE 'Coluna "state_legacy" adicionada e preenchida';
    END IF;
END $$;

-- Criar índices em neighborhood (se não existirem)
CREATE INDEX IF NOT EXISTS "neighborhood_city_id_idx" ON "neighborhood"("city_id");
CREATE INDEX IF NOT EXISTS "neighborhood_region_id_idx" ON "neighborhood"("region_id");

-- Adicionar foreign keys de neighborhood (se não existirem)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'neighborhood_city_id_fkey'
    ) THEN
        ALTER TABLE "neighborhood" 
        ADD CONSTRAINT "neighborhood_city_id_fkey" 
        FOREIGN KEY ("city_id") 
        REFERENCES "city"("id") 
        ON DELETE CASCADE;
        RAISE NOTICE 'Foreign key neighborhood.city_id criada';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'neighborhood_region_id_fkey'
    ) THEN
        ALTER TABLE "neighborhood" 
        ADD CONSTRAINT "neighborhood_region_id_fkey" 
        FOREIGN KEY ("region_id") 
        REFERENCES "region"("id") 
        ON DELETE SET NULL;
        RAISE NOTICE 'Foreign key neighborhood.region_id criada';
    END IF;
END $$;

-- 5. Atualizar tabela address: adicionar colunas novas (se não existirem)
DO $$ 
BEGIN
    -- Adicionar neighborhood_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'address' AND column_name = 'neighborhood_id'
    ) THEN
        ALTER TABLE "address" ADD COLUMN "neighborhood_id" TEXT;
        RAISE NOTICE 'Coluna "neighborhood_id" adicionada à tabela "address"';
    END IF;

    -- Adicionar street_number se não existir (renomear de "number")
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'address' AND column_name = 'street_number'
    ) THEN
        -- Se "number" existe, copiar para street_number e depois renomear
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'address' AND column_name = 'number'
        ) THEN
            ALTER TABLE "address" ADD COLUMN "street_number" TEXT;
            UPDATE "address" SET "street_number" = "number" WHERE "street_number" IS NULL;
            RAISE NOTICE 'Coluna "street_number" criada e preenchida a partir de "number"';
        ELSE
            ALTER TABLE "address" ADD COLUMN "street_number" TEXT;
            RAISE NOTICE 'Coluna "street_number" adicionada';
        END IF;
    END IF;

    -- Adicionar postal_code se não existir (renomear de "zipcode")
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'address' AND column_name = 'postal_code'
    ) THEN
        -- Se "zipcode" existe, copiar para postal_code
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'address' AND column_name = 'zipcode'
        ) THEN
            ALTER TABLE "address" ADD COLUMN "postal_code" TEXT;
            UPDATE "address" SET "postal_code" = "zipcode" WHERE "postal_code" IS NULL;
            RAISE NOTICE 'Coluna "postal_code" criada e preenchida a partir de "zipcode"';
        ELSE
            ALTER TABLE "address" ADD COLUMN "postal_code" TEXT;
            RAISE NOTICE 'Coluna "postal_code" adicionada';
        END IF;
    END IF;

    -- Garantir que campos legacy existam (não remover ainda)
    -- district, city, state, zipcode já devem existir
END $$;

-- Criar índices em address (se não existirem)
CREATE INDEX IF NOT EXISTS "address_neighborhood_id_idx" ON "address"("neighborhood_id");
CREATE INDEX IF NOT EXISTS "idx_address_lat_lng" ON "address"("lat", "lng") WHERE "lat" IS NOT NULL AND "lng" IS NOT NULL;

-- Adicionar foreign key de address para neighborhood (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'address_neighborhood_id_fkey'
    ) THEN
        ALTER TABLE "address" 
        ADD CONSTRAINT "address_neighborhood_id_fkey" 
        FOREIGN KEY ("neighborhood_id") 
        REFERENCES "neighborhood"("id") 
        ON DELETE CASCADE;
        RAISE NOTICE 'Foreign key address.neighborhood_id criada';
    END IF;
END $$;

-- 6. Atualizar tabela Property: tornar addressId único (one-to-one)
DO $$ 
BEGIN
    -- Verificar se já é único
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Property_addressId_key'
    ) THEN
        -- Criar índice único (pode falhar se houver duplicatas)
        BEGIN
            CREATE UNIQUE INDEX "Property_addressId_key" ON "Property"("addressId");
            RAISE NOTICE 'Índice único criado em Property.addressId';
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Não foi possível criar índice único em Property.addressId (pode haver duplicatas)';
        END;
    END IF;
END $$;

-- Verificar resultado
SELECT 
    'state' as tabela,
    COUNT(*) as total_registros,
    '✅' as status
FROM "state"
UNION ALL
SELECT 
    'city',
    COUNT(*),
    '✅'
FROM "city"
UNION ALL
SELECT 
    'region',
    COUNT(*),
    '✅'
FROM "region"
UNION ALL
SELECT 
    'neighborhood (com city_id)',
    COUNT(*),
    CASE WHEN COUNT(*) = COUNT("city_id") THEN '✅' ELSE '⚠️' END
FROM "neighborhood"
UNION ALL
SELECT 
    'address (com neighborhood_id)',
    COUNT(*),
    CASE WHEN COUNT(*) = COUNT("neighborhood_id") THEN '✅' ELSE '⚠️' END
FROM "address"
ORDER BY tabela;

-- Mensagem final
DO $$ 
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migração concluída!';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '   1. Inserir dados em state, city, region via SQL';
    RAISE NOTICE '   2. Executar backfill para preencher city_id e region_id em neighborhood';
    RAISE NOTICE '   3. Executar backfill para preencher neighborhood_id em address';
END $$;


# 📋 Scripts SQL - Ordem de Execução

## ⚠️ IMPORTANTE: Ordem de Execução

Execute os scripts SQL nesta ordem:

### 1️⃣ Criar Tabelas (State, City, Region)

```bash
psql $DATABASE_URL -f prisma/sql/00_create_tables.sql
```

Este script cria as tabelas `state`, `city` e `region` no banco de dados.

### 2️⃣ Inserir Dados (State, City, Region, Neighborhood)

Execute seus scripts SQL para inserir:
- Estados
- Cidades  
- Regiões
- Bairros (neighborhoods)

### 3️⃣ Atualizar Tabelas Existentes (Address, Neighborhood)

Se necessário, execute o script de backfill para atualizar as relações:

```bash
psql $DATABASE_URL -f prisma/sql/02_backfill_data.sql
```

### 4️⃣ (Opcional) Configurar PostGIS

Se quiser usar PostGIS:

```bash
psql $DATABASE_URL -f prisma/sql/01_postgis_setup.sql
psql $DATABASE_URL -f prisma/sql/02_spatial_indexes.sql
```

### 5️⃣ (Opcional) Índices Lat/Lng

Se NÃO usar PostGIS:

```bash
psql $DATABASE_URL -f prisma/sql/03_latlng_indexes.sql
```

---

## 📝 Notas

- Os scripts são **idempotentes** (podem ser executados múltiplas vezes)
- Use `IF NOT EXISTS` para evitar erros se as tabelas já existirem
- Sempre faça backup antes de executar em produção


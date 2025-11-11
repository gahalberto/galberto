# 🌱 Seed de Localização

Este seed popula o banco de dados com dados de localização (Estados, Cidades, Regiões, Bairros e Endereços) a partir dos arquivos JSON em `prisma/data/`.

## 📋 Pré-requisitos

1. **Tabelas criadas**: Execute primeiro o SQL de criação de tabelas:
   ```bash
   # Via Docker
   cat prisma/sql/00_add_location_tables.sql | docker exec -i gabrielimoveis-db psql -U postgres -d gabrielimoveis
   
   # Ou via script helper
   ./prisma/sql/run_in_docker.sh 00_add_location_tables.sql
   ```

2. **Prisma Client gerado**: 
   ```bash
   pnpm prisma generate
   ```

## 🚀 Como Executar

```bash
# Executar o seed
pnpm tsx prisma/seed-location.ts
```

## 📊 O que o seed faz

1. **Estados** (`estados.json`): Cria todos os estados brasileiros
2. **Regiões** (`region.json`): Cria todas as regiões (Zona Sul, Zona Oeste, etc)
3. **Cidades** (`cities-cidades.json`): Cria todas as cidades, vinculando aos estados
4. **Bairros** (`bairros.json`): Cria todos os bairros, vinculando às cidades e regiões
5. **Endereços** (`address.json`): Cria todos os endereços, vinculando aos bairros

## 🔄 Mapeamento de IDs

O seed faz o mapeamento automático de IDs antigos (numéricos) para IDs novos (cuid):

- `stateIdMap`: Mapeia `estado.id` (antigo) → `State.id` (novo)
- `regionIdMap`: Mapeia `region.id` (antigo) → `Region.id` (novo)
- `cityIdMap`: Mapeia `city.id` (antigo) → `City.id` (novo)
- `neighborhoodIdMap`: Mapeia `neighborhood.id` (antigo) → `Neighborhood.id` (novo)

## ⚠️ Notas Importantes

- O seed é **idempotente**: pode ser executado múltiplas vezes sem duplicar dados
- Usa `upsert` para estados, regiões e cidades (baseado em `code` ou `name`)
- Usa `createMany` com `skipDuplicates: true` para endereços (processamento em lote)
- Gera slugs automaticamente para bairros a partir do nome

## 📁 Estrutura dos Arquivos JSON

### estados.json
```json
{"id": 26, "name": "São Paulo", "code": "SP"}
```

### cities-cidades.json
```json
{"id": 3, "name": "São Paulo", "state_id": 26}
```

### region.json
```json
{"id": 5, "name": "Zona Sul", "is_active": true}
```

### bairros.json
```json
{"id": 89, "name": "Vila Yara", "city_id": 6, "region_id": 21}
```

### address.json
```json
{"id": 2310, "street": "Rua X", "street_number": "400", "postal_code": "11704450", "neighborhood_id": 482}
```

## 🐛 Troubleshooting

### Erro: "Property 'state' does not exist"
**Solução**: Execute `pnpm prisma generate` para regenerar o Prisma Client.

### Erro: "Foreign key constraint"
**Solução**: Certifique-se de que executou o SQL de criação de tabelas primeiro.

### Endereços não são criados
**Solução**: Verifique se os bairros foram criados corretamente. O seed pula endereços cujo `neighborhood_id` não existe.

## 📈 Performance

- Estados e Regiões: Processamento individual (poucos registros)
- Cidades: Processamento individual com verificação de duplicatas
- Bairros: Processamento individual com geração de slug
- Endereços: Processamento em lotes de 100 registros para melhor performance


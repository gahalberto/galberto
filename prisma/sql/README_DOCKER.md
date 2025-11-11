# 🐳 Executando Scripts SQL no Docker

## Opção 1: Script Helper (Recomendado)

```bash
# Executar o script helper
./prisma/sql/run_in_docker.sh 00_add_location_tables.sql
```

## Opção 2: Docker Exec Direto

```bash
# Copiar arquivo para o container
docker cp prisma/sql/00_add_location_tables.sql gabrielimoveis-db:/tmp/migration.sql

# Executar SQL
docker exec -i gabrielimoveis-db psql -U postgres -d gabrielimoveis -f /tmp/migration.sql

# Limpar
docker exec gabrielimoveis-db rm -f /tmp/migration.sql
```

## Opção 3: Dentro do Container

```bash
# Entrar no container
docker exec -it gabrielimoveis-db sh

# Dentro do container, copiar o arquivo primeiro (de outro terminal):
# docker cp prisma/sql/00_add_location_tables.sql gabrielimoveis-db:/tmp/migration.sql

# Executar
psql -U postgres -d gabrielimoveis -f /tmp/migration.sql
```

## Opção 4: Via STDIN (Pipe)

```bash
cat prisma/sql/00_add_location_tables.sql | docker exec -i gabrielimoveis-db psql -U postgres -d gabrielimoveis
```

## Credenciais do Banco

- **Container**: `gabrielimoveis-db`
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Database**: `gabrielimoveis`
- **Porta**: `5432`

## Verificar se o Container está Rodando

```bash
docker ps | grep gabrielimoveis-db
```

Se não estiver rodando:

```bash
docker-compose up -d
```


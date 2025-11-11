#!/bin/bash
# Script para executar SQL no Docker
# Uso: ./run_in_docker.sh 00_add_location_tables.sql

SCRIPT_FILE=${1:-00_add_location_tables.sql}
CONTAINER_NAME="gabrielimoveis-db"
DB_NAME="gabrielimoveis"
DB_USER="postgres"

echo "📦 Executando $SCRIPT_FILE no container Docker..."

# Verificar se o container está rodando
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ Container $CONTAINER_NAME não está rodando!"
    echo "💡 Execute: docker-compose up -d"
    exit 1
fi

# Copiar o arquivo SQL para dentro do container
echo "📋 Copiando arquivo para o container..."
docker cp "prisma/sql/$SCRIPT_FILE" "$CONTAINER_NAME:/tmp/$SCRIPT_FILE"

# Executar o SQL dentro do container
echo "🚀 Executando SQL..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f "/tmp/$SCRIPT_FILE"

# Limpar arquivo temporário
docker exec "$CONTAINER_NAME" rm -f "/tmp/$SCRIPT_FILE"

echo "✅ Concluído!"


#!/bin/bash

echo "🚀 Gabriel Alberto Imóveis - Setup Automático"
echo "=============================================="
echo ""

# Verificar se o pnpm está instalado
if ! command -v pnpm &> /dev/null
then
    echo "❌ pnpm não encontrado. Instalando..."
    npm install -g pnpm
fi

echo "📦 Instalando dependências..."
pnpm install

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Configure o DATABASE_URL no arquivo .env"
    echo ""
    read -p "Pressione ENTER para continuar após configurar o .env..."
fi

echo ""
echo "🗄️  Configurando banco de dados..."
pnpm db:generate
pnpm db:push

echo ""
echo "🌱 Populando banco com dados de exemplo..."
pnpm db:seed

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "  1. pnpm dev - Iniciar servidor de desenvolvimento"
echo "  2. Acesse http://localhost:3000"
echo "  3. Admin: http://localhost:3000/admin"
echo ""
echo "📧 Login admin: admin@gabrielalbertoimoveis.com.br"
echo "🔑 Senha: admin123"
echo ""
echo "🎉 Bom desenvolvimento!"


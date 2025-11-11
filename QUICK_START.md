# 🚀 Quick Start - Gabriel Alberto Imóveis

## Início Rápido em 5 Passos

### 1️⃣ Instale as dependências
```bash
cd gabrielimoveis
pnpm install
```

### 2️⃣ Configure o banco de dados
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais do PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/gabrielimoveis"

# Crie as tabelas
pnpm db:push
```

### 3️⃣ Popule com dados de exemplo
```bash
pnpm db:seed
```

Isso criará:
- ✅ 1 usuário admin
- ✅ 6 imóveis de exemplo
- ✅ 3 bairros
- ✅ 11 amenities
- ✅ 2 leads de exemplo

### 4️⃣ Inicie o servidor
```bash
pnpm dev
```

### 5️⃣ Acesse o site
- 🌐 **Site público**: http://localhost:3000
- 🔐 **Admin**: http://localhost:3000/admin
- 📧 **Login**: admin@gabrielalbertoimoveis.com.br
- 🔑 **Senha**: admin123 (padrão, altere no .env)

## 📝 Próximos Passos

### Configurações Recomendadas

1. **Altere as credenciais de admin** no arquivo `.env`:
```env
ADMIN_EMAIL="seu@email.com"
ADMIN_PASSWORD="SuaSenhaSegura123"
```

2. **Configure o Mapbox** (opcional, para mapas):
   - Crie uma conta em https://mapbox.com
   - Obtenha seu token
   - Adicione ao `.env`:
```env
NEXT_PUBLIC_MAPBOX_TOKEN="seu_token_aqui"
```

3. **Configure email** (opcional, para notificações):
```env
RESEND_API_KEY="seu_resend_api_key"
```

### Comandos Úteis

```bash
# Ver banco de dados visualmente
pnpm db:studio

# Verificar tipos
pnpm typecheck

# Formatar código
pnpm format

# Build para produção
pnpm build
```

## 🎨 Personalizando

### Alterar informações do site

Edite `/lib/constants.ts`:
- Nome da imobiliária
- Telefone e WhatsApp
- Endereço
- Redes sociais

### Alterar cores e tema

Edite `/app/globals.css` - variáveis CSS:
- `--primary`
- `--secondary`
- etc.

### Adicionar novos componentes shadcn/ui

```bash
pnpx shadcn@latest add [component-name]
```

Exemplos:
```bash
pnpx shadcn@latest add alert
pnpx shadcn@latest add dropdown-menu
pnpx shadcn@latest add calendar
```

## 🐛 Problemas Comuns

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `pnpm db:studio`

### Erro no seed
- Limpe o banco: apague o arquivo do DB e rode `pnpm db:push` novamente
- Ou use migrations: `pnpm db:migrate`

### Imagens não carregam
- As imagens do seed vêm do Unsplash
- Verifique sua conexão com internet
- Em produção, use suas próprias imagens

## 📚 Documentação Completa

Consulte o **README.md** para documentação detalhada sobre:
- Estrutura do projeto
- Modelagem do banco
- SEO e JSON-LD
- Deploy
- E muito mais!

## 🆘 Precisa de Ajuda?

- 📖 Leia o README.md completo
- 🔍 Veja os exemplos no código
- 💬 Entre em contato: contato@gabrielalbertoimoveis.com.br

---

**Bom desenvolvimento! 🎉**


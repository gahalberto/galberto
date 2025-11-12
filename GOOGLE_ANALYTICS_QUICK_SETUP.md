# ⚡ Configuração Rápida do Google Analytics

## ✅ Seu ID de Medição: `G-2VNWSSCWQC`

## 🚀 Passos Rápidos

### 1. Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local` com:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2VNWSSCWQC
```

### 2. Configurar no Vercel (Produção)

1. Acesse o painel do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-2VNWSSCWQC`
   - **Environments**: Marque Production, Preview e Development
4. Clique em **Save**
5. Faça um novo deploy

### 3. Testar

1. Acesse o site em produção ou localmente
2. No Google Analytics, vá em **Relatórios** → **Tempo real**
3. Você deve ver sua visita aparecendo em alguns segundos

## ✅ Pronto!

O Google Analytics já está configurado no código. Basta adicionar a variável de ambiente e fazer deploy.

## 📊 O que está sendo rastreado automaticamente:

- ✅ Visualizações de páginas
- ✅ Visualizações de imóveis (`view_item`)
- ✅ Geração de leads (`generate_lead`)

## 🔍 Verificar se está funcionando

1. Abra o DevTools (F12)
2. Vá na aba **Network**
3. Filtre por `gtag` ou `googletagmanager`
4. Você deve ver requisições sendo feitas

---

**Dúvidas?** Consulte o arquivo `GOOGLE_ANALYTICS_SETUP.md` para instruções detalhadas.


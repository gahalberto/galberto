# 📊 Guia de Instalação do Google Analytics 4

Este guia explica como configurar o Google Analytics 4 (GA4) no site **galberto.com.br**.

---

## 📋 Pré-requisitos

1. Conta no Google Analytics
2. Acesso ao Google Analytics 4 (GA4)
3. ID de medição (Measurement ID) do GA4

---

## 🔧 Passo 1: Criar Propriedade no Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Clique em **Administrador** (ícone de engrenagem)
3. Na coluna **Propriedade**, clique em **Criar propriedade**
4. Preencha:
   - **Nome da propriedade**: `Gabriel Alberto Imóveis`
   - **Fuso horário**: `(GMT-03:00) Brasília`
   - **Moeda**: `Real brasileiro (R$)`
5. Clique em **Avançar**
6. Configure informações do negócio:
   - **Setor**: `Imóveis`
   - **Tamanho da empresa**: Selecione o tamanho apropriado
7. Clique em **Criar**
8. Aceite os termos de serviço

---

## 🔑 Passo 2: Obter o ID de Medição (Measurement ID)

1. Após criar a propriedade, você verá a tela de **Configuração de fluxo de dados**
2. Selecione **Web** como plataforma
3. Configure:
   - **URL do site**: `https://galberto.com.br`
   - **Nome do fluxo**: `galberto.com.br`
4. Clique em **Criar fluxo**
5. Você verá o **ID de medição** (formato: `G-XXXXXXXXXX`)
6. **Copie este ID** - você precisará dele no próximo passo

---

## ⚙️ Passo 3: Configurar Variável de Ambiente

### ✅ Seu ID de Medição: `G-2VNWSSCWQC`

1. No projeto, crie o arquivo `.env.local` na raiz do projeto:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2VNWSSCWQC
```

**⚠️ IMPORTANTE:**
- O prefixo `NEXT_PUBLIC_` é obrigatório para variáveis acessíveis no cliente
- Não commite o arquivo `.env.local` no Git (já deve estar no `.gitignore`)
- Copie o arquivo `.env.example` para `.env.local` e ajuste os valores

2. Se estiver usando **Vercel** ou outro serviço de hospedagem:
   - Vá em **Settings** → **Environment Variables**
   - Adicione a variável:
     - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
     - **Value**: `G-2VNWSSCWQC`
   - Selecione os ambientes (Production, Preview, Development)
   - Clique em **Save**

---

## ✅ Passo 4: Verificar Instalação

O Google Analytics já está configurado no código! Os arquivos criados são:

1. **`components/google-analytics.tsx`** - Componente do GA4
2. **`app/layout.tsx`** - Layout atualizado com GA4

### Para testar localmente:

1. Certifique-se de que a variável `NEXT_PUBLIC_GA_MEASUREMENT_ID` está configurada
2. Execute o projeto:
   ```bash
   pnpm dev
   ```
3. Acesse o site no navegador
4. Abra o **DevTools** (F12) → **Console**
5. Você deve ver requisições para `googletagmanager.com`
6. No Google Analytics, vá em **Relatórios** → **Tempo real**
7. Você deve ver sua visita aparecendo em alguns segundos

---

## 🎯 Eventos Customizados Implementados

O projeto já inclui funções para rastrear eventos importantes:

### 1. Visualização de Imóvel

```typescript
import { trackPropertyView } from '@/components/google-analytics'

// Em uma página de imóvel
trackPropertyView(property.slug, property.title)
```

### 2. Geração de Lead

```typescript
import { trackLead } from '@/components/google-analytics'

// Quando um lead é gerado
trackLead('formulario-contato', propertySlug)
```

### 3. Eventos Customizados

```typescript
import { trackEvent } from '@/components/google-analytics'

// Exemplo: rastrear clique em botão
trackEvent('click', 'button', 'whatsapp-button')
```

---

## 📊 Configurações Recomendadas no Google Analytics

### 1. Configurar Conversões

1. Vá em **Administrador** → **Eventos**
2. Marque os seguintes eventos como conversões:
   - `generate_lead` - Geração de leads
   - `view_item` - Visualização de imóvel

### 2. Configurar Audiences

Crie audiências para:
- Visitantes que visualizaram imóveis
- Visitantes que geraram leads
- Visitantes que visitaram páginas de investimento

### 3. Configurar Relatórios Personalizados

Crie relatórios para:
- Imóveis mais visualizados
- Origem dos leads
- Páginas mais visitadas
- Taxa de conversão por bairro

---

## 🔍 Verificação Final

### Checklist de Verificação:

- [ ] Propriedade criada no Google Analytics
- [ ] ID de medição obtido
- [ ] Variável `NEXT_PUBLIC_GA_MEASUREMENT_ID` configurada
- [ ] Site em produção com a variável configurada
- [ ] Teste de tempo real funcionando
- [ ] Eventos customizados implementados (opcional)

---

## 🚨 Troubleshooting

### Problema: Google Analytics não está rastreando

**Soluções:**
1. Verifique se a variável `NEXT_PUBLIC_GA_MEASUREMENT_ID` está configurada
2. Verifique se o ID está correto (formato `G-XXXXXXXXXX`)
3. Limpe o cache do navegador
4. Verifique o console do navegador para erros
5. Use a extensão [Google Tag Assistant](https://tagassistant.google.com/) para verificar

### Problema: Eventos não aparecem

**Soluções:**
1. Verifique se os eventos estão sendo disparados (console do navegador)
2. Aguarde 24-48 horas para eventos aparecerem em relatórios históricos
3. Use **Tempo real** para ver eventos imediatamente
4. Verifique se o evento está configurado corretamente no código

### Problema: Dados não aparecem em tempo real

**Soluções:**
1. Tempo real pode ter delay de alguns segundos
2. Verifique se não há bloqueadores de anúncios ativos
3. Verifique se o modo de navegação anônima está desativado
4. Certifique-se de que está logado na conta correta do Google Analytics

---

## 📚 Recursos Adicionais

- [Documentação do Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Guia de Migração para GA4](https://support.google.com/analytics/answer/10089681)
- [Google Tag Manager](https://tagmanager.google.com/) (alternativa mais avançada)

---

## 🎉 Pronto!

Seu Google Analytics 4 está configurado e funcionando! 

Os dados começarão a aparecer em **Tempo real** imediatamente e em **Relatórios** após algumas horas.

Para dúvidas ou problemas, consulte a [documentação oficial do GA4](https://support.google.com/analytics/answer/9304153).


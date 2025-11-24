# Guia de Configuração do Blog

## 📋 Checklist de Implementação

✅ Modelo BlogPost criado no Prisma  
✅ Funções de SEO (JSON-LD) implementadas  
✅ Página de listagem `/blog` com busca e filtros  
✅ Página individual `/blog/[slug]` com renderização Markdown  
✅ Componentes do blog criados (BlogCard, BlogSidebar, BlogCTA, BlogFAQ)  
✅ Feed RSS `/blog/rss.xml`  
✅ Sitemap do blog `/blog-sitemap.xml`  
✅ OG Image dinâmico `/api/og/blog`  
✅ Integração com sitemap principal  

## 🚀 Próximos Passos

### 1. Executar Migração do Banco de Dados

```bash
pnpm db:generate
pnpm db:migrate
```

### 2. Criar Posts Iniciais

Veja sugestões abaixo na seção "Sugestões de Posts Iniciais".

### 3. Adicionar Link no Menu

Adicione um link para `/blog` no header do site.

## 📝 Sugestões de 5 Posts Iniciais

### 1. **"Guia Completo: Como Comprar seu Primeiro Imóvel em São Paulo"**
- **Categoria:** GUIA_COMPRADOR
- **Keywords:** comprar imóvel, primeiro imóvel, São Paulo, guia comprador, dicas imobiliárias
- **Excerpt:** "Descubra tudo o que você precisa saber para comprar seu primeiro imóvel em São Paulo. Passo a passo completo desde a escolha até a escritura."
- **Conteúdo sugerido:**
  - Passo a passo da compra
  - Documentação necessária
  - Financiamento e programas governamentais
  - Checklist antes de fechar negócio
  - Erros comuns a evitar

### 2. **"Investimento Imobiliário: 5 Bairros de São Paulo com Maior Valorização em 2024"**
- **Categoria:** VALORIZACAO_BAIRROS
- **Keywords:** investimento imobiliário, valorização, bairros São Paulo, ROI, investir em imóveis
- **Excerpt:** "Conheça os bairros de São Paulo que mais valorizaram nos últimos anos e descubra oportunidades de investimento imobiliário com alto potencial de retorno."
- **Conteúdo sugerido:**
  - Análise de 5 bairros específicos
  - Dados de valorização histórica
  - Projeções futuras
  - Perfil de investidor ideal para cada região
  - Dicas de timing de compra

### 3. **"Minha Casa Minha Vida 2024: Tudo o que Você Precisa Saber"**
- **Categoria:** FINANCIAMENTOS
- **Keywords:** minha casa minha vida, MCMV, financiamento imobiliário, programa habitacional, FGTS
- **Excerpt:** "Guia completo sobre o programa Minha Casa Minha Vida em 2024. Entenda as novas regras, quem pode participar e como se inscrever."
- **Conteúdo sugerido:**
  - Novas regras do programa
  - Faixas de renda e valores
  - Como se inscrever
  - Documentação necessária
  - Dúvidas frequentes

### 4. **"Airbnb em São Paulo: Vale a Pena Investir em Imóveis para Aluguel Temporário?"**
- **Categoria:** INVESTIMENTOS
- **Keywords:** Airbnb, aluguel temporário, investimento imobiliário, renda passiva, São Paulo
- **Excerpt:** "Análise completa sobre investir em imóveis para Airbnb em São Paulo. Descubra se essa estratégia é lucrativa e quais os melhores bairros."
- **Conteúdo sugerido:**
  - Análise de rentabilidade
  - Melhores bairros para Airbnb
  - Requisitos legais
  - Custos e despesas
  - Dicas para maximizar receita

### 5. **"Tendências do Mercado Imobiliário em São Paulo: O que Esperar em 2024"**
- **Categoria:** TENDENCIAS
- **Keywords:** mercado imobiliário, tendências, São Paulo, previsões, análise de mercado
- **Excerpt:** "Análise das principais tendências do mercado imobiliário paulistano em 2024. Entenda para onde o mercado está indo e como se posicionar."
- **Conteúdo sugerido:**
  - Análise de dados do mercado
  - Tendências de preços
  - Novos lançamentos
  - Perfil de compradores
  - Oportunidades e desafios

## 🎯 Template de CTA (Call to Action)

O componente `BlogCTA` já está implementado e aparece automaticamente no final de cada post. Ele inclui:

- Título chamativo
- Descrição personalizada
- Botão WhatsApp com mensagem pré-formatada
- Botão de telefone
- Informações de horário de atendimento

### Personalização do CTA

O CTA pode ser customizado editando `components/blog/blog-cta.tsx`. Você pode:

1. **Criar variações por categoria:**
   - CTA específico para posts de investimento
   - CTA específico para posts de financiamento
   - CTA específico para guias

2. **Adicionar formulário de lead:**
   - Integrar com o componente `LeadForm` existente
   - Capturar leads diretamente do blog

3. **A/B Testing:**
   - Testar diferentes textos e layouts
   - Medir conversão por tipo de post

## 📊 Estrutura de Dados do BlogPost

```typescript
{
  id: string
  slug: string (único)
  title: string
  excerpt: string (texto curto para preview)
  content: string (Markdown completo)
  coverImage?: string (URL da imagem)
  category: BlogCategory (enum)
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  canonicalUrl?: string
  ogImage?: string
  
  // Autor
  author: string (default: "Gabriel Alberto")
  authorBio?: string
  publishedAt?: Date
  
  // FAQ (opcional)
  faq?: Array<{ question: string; answer: string }>
  
  // Engajamento
  views: number (default: 0)
  readingTime?: number (minutos)
  
  // Control
  published: boolean (default: false)
  featured: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

## 🔍 SEO e Otimizações Implementadas

### JSON-LD Schema
- ✅ BlogPosting schema completo
- ✅ BreadcrumbList
- ✅ FAQPage (quando aplicável)
- ✅ Author e Publisher information
- ✅ Keywords e about fields para IA

### Metadata
- ✅ Title e description otimizados
- ✅ OpenGraph completo
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Keywords meta tag

### Performance
- ✅ Lazy loading de imagens
- ✅ Revalidação de cache (1 hora)
- ✅ Edge runtime para OG images
- ✅ Semantic HTML

### Acessibilidade
- ✅ ARIA labels
- ✅ Semantic tags
- ✅ Alt text em imagens
- ✅ Breadcrumb navigation

## 📱 Feed RSS

O feed RSS está disponível em `/blog/rss.xml` e inclui:
- Últimos 20 posts publicados
- Título, descrição e conteúdo completo
- Data de publicação
- Autor
- Imagem de capa

## 🗺️ Sitemaps

- **Sitemap principal:** `/sitemap.xml` (inclui posts do blog)
- **Sitemap do blog:** `/blog-sitemap.xml` (apenas posts)
- **Robots.txt:** Atualizado para incluir ambos os sitemaps

## 🎨 Componentes Disponíveis

1. **BlogCard** - Card de post na listagem
2. **BlogSidebar** - Sidebar com categorias e posts populares
3. **BlogCTA** - Call to action no final dos posts
4. **BlogFAQ** - Seção de perguntas frequentes
5. **BlogSearch** - Barra de busca
6. **MarkdownContent** - Renderizador de Markdown
7. **BlogViewTracker** - Rastreador de visualizações

## 💡 Dicas de Conteúdo

1. **Títulos:** Use números, perguntas e palavras de ação
2. **Excerpt:** 120-160 caracteres, inclua a palavra-chave principal
3. **Conteúdo:** Mínimo de 1000 palavras para SEO
4. **Imagens:** Use imagens próprias ou com direitos de uso
5. **FAQ:** Adicione FAQ em posts educativos (melhora SEO)
6. **Keywords:** 5-10 palavras-chave relevantes por post
7. **Reading Time:** Calcule automaticamente (250 palavras/minuto)

## 🔗 Links Úteis

- Listagem do blog: `/blog`
- Feed RSS: `/blog/rss.xml`
- Sitemap do blog: `/blog-sitemap.xml`
- OG Image API: `/api/og/blog?slug=seu-slug`

## 📈 Próximas Melhorias Sugeridas

1. **Sistema de comentários** (Disqus ou similar)
2. **Compartilhamento social** (botões de share)
3. **Posts relacionados** (baseado em categoria/tags)
4. **Newsletter** (captura de email)
5. **Analytics** (rastreamento de engajamento)
6. **Editor WYSIWYG** (para facilitar criação de posts)
7. **Sistema de tags** (além de categorias)
8. **Busca avançada** (filtros múltiplos)




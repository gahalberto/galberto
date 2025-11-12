# Pasta Public

Esta pasta contém arquivos estáticos que são servidos diretamente pelo Next.js.

## Estrutura

```
public/
├── images/
│   ├── logos/          # Logos da imobiliária
│   ├── imoveis/        # Imagens de imóveis (opcional)
│   ├── bairros/        # Imagens de bairros
│   └── og/             # Imagens Open Graph para redes sociais
├── favicons/           # Favicons e ícones do site
└── ...
```

## Como usar

### Imagens

Para usar imagens desta pasta no seu código, use o caminho começando com `/`:

```tsx
// Exemplo: Logo
<img src="/images/logos/logo.png" alt="Logo" />

// Exemplo: Imagem de imóvel
<img src="/images/imoveis/apartamento-123.jpg" alt="Apartamento" />
```

### No Admin

Ao cadastrar um imóvel no admin, você pode usar URLs locais:

- `/images/imoveis/nome-da-imagem.jpg` - Para imagens locais
- `https://exemplo.com/imagem.jpg` - Para imagens externas

## Recomendações

- **Logos**: Use SVG quando possível (melhor qualidade e menor tamanho)
- **Imagens de imóveis**: JPG otimizado, máximo 2MB por imagem
- **Open Graph**: 1200x630px, formato JPG ou PNG
- **Favicons**: Múltiplos tamanhos (16x16, 32x32, 180x180, etc)




import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Download, Video, MapPin, Calendar, TrendingUp, Building2, Users, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SITE_CONFIG } from '@/lib/constants'
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo'
import { GalleryCarousel } from './_components/gallery-carousel'
import { DownloadForm } from './_components/download-form'

// ============================================================================
// CONFIGURAÇÕES DO EMPREENDIMENTO
// ============================================================================
// TODO: Substituir estes dados pelos dados reais do JSON quando disponível
const PROPERTY_DATA = {
  name: 'Folks Vila Mariana',
  developer: 'Mamute Incorporadora',
  status: 'EM_OBRAS', // COMPLETE com entrega em 10/2025
  deliveryDate: '10/2025',
  address: {
    street: 'Rua Cubatão',
    number: '1038',
    district: 'Vila Mariana',
    city: 'São Paulo',
    state: 'SP',
    zipcode: '04013-000',
    country: 'Brasil',
  },
  coordinates: {
    lat: -23.5795481,
    lng: -46.642024,
  },
  units: [
    { type: 'Studio/NR', area: 17, price: 277197, bedrooms: 0 },
    { type: '1 dormitório', area: 37, price: 538500, bedrooms: 1 },
    { type: '2 dormitórios', area: 37, price: 575441, bedrooms: 2 },
  ],
  characteristics: [
    'Fitness',
    'Churrasqueira',
    'Salão de festas',
    'Espaço gourmet',
    'Piscina adulto',
    'Solarium',
    'Business place',
    'Terraço coletivo',
  ],
  // Imagens do empreendimento
  images: [
    '/images/folks/folks1.webp',
    '/images/folks/Empreendimento Foto 01.webp',
    '/images/folks/Foto do empreendimento - 04.webp',
    '/images/folks/Empreendimento 05.webp',
    '/images/folks/Empreendimento 06.webp',
    '/images/folks/Empreendimento 10.webp',
    '/images/folks/Empreendimento 13.webp',
    '/images/folks/Empreendimento 14.webp',
    '/images/folks/Empreendimento 15.webp',
    '/images/folks/Empreendimento 18.webp',
    '/images/folks/Empreendimento 22.webp',
  ],
  videoUrl: '', // TODO: URL do YouTube do JSON
  bookUrl: '/images/folks/Book Folks Vila Mariana.pdf',
  technicalSheetUrl: '', // TODO: URL do PDF EXTRA_MATERIALS do JSON
  priceTableUrl: '', // TODO: URL do PDF TABLE do JSON
  description: `
    O Folks Vila Mariana é um empreendimento moderno e estratégico, localizado em uma das regiões mais valorizadas de São Paulo. 
    Com unidades compactas e funcionais, o projeto oferece o equilíbrio perfeito entre qualidade de vida e investimento inteligente.
    
    A torre única do empreendimento abriga studios e apartamentos de 1 e 2 dormitórios, todos com acabamento de alto padrão e 
    design contemporâneo. A localização privilegiada na Vila Mariana garante fácil acesso ao metrô, principais vias de São Paulo 
    e uma infinidade de serviços, comércios e opções de lazer.
    
    Ideal para investidores que buscam ativos imobiliários com alta demanda de locação e potencial de valorização, o Folks Vila Mariana 
    representa uma oportunidade única no mercado imobiliário paulistano.
  `,
}

// Número de WhatsApp - pode ser alterado aqui
const WHATSAPP_NUMBER = SITE_CONFIG.whatsapp

// Mensagens pré-formatadas para WhatsApp
const WHATSAPP_MESSAGES = {
  main: 'Olá, quero analisar o investimento no Folks Vila Mariana.',
  materials: 'Olá, gostaria de receber os materiais do Folks Vila Mariana.',
  consultation: 'Olá, gostaria de agendar uma consultoria para investimento no Folks Vila Mariana.',
}

// ============================================================================
// METADATA E SEO
// ============================================================================
export const metadata: Metadata = {
  title: 'Investir no Folks Vila Mariana — Imóvel para investimento em São Paulo | Gabriel Alberto Imóveis',
  description:
    'Invista no Folks Vila Mariana, na Vila Mariana, São Paulo. Studios e apartamentos de 17m² a 37m², a partir de R$ 277 mil. Entrega em 2025. Alta demanda de locação, próximo ao metrô. Consultoria com Gabriel Alberto, CRECI 267769.',
  keywords: [
    'investir em imóveis',
    'Folks Vila Mariana',
    'investimento imobiliário São Paulo',
    'apartamento para investimento',
    'studio para alugar',
    'Vila Mariana imóveis',
    'investimento imobiliário 2025',
    'imóvel próximo metrô',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/investir/folks-vila-mariana`,
    languages: {
      'pt-BR': `${SITE_CONFIG.url}/investir/folks-vila-mariana`,
      en: `${SITE_CONFIG.url}/en/invest/folks-vila-mariana`,
    },
  },
  openGraph: {
    type: 'website',
    title: 'Investir no Folks Vila Mariana — Oportunidade de Investimento em São Paulo',
    description:
      'Studios e apartamentos compactos na Vila Mariana, a partir de R$ 277 mil. Entrega em 2025. Alta demanda de locação, próximo ao metrô.',
    url: `${SITE_CONFIG.url}/investir/folks-vila-mariana`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: PROPERTY_DATA.images[0]?.startsWith('http')
          ? PROPERTY_DATA.images[0]
          : `${SITE_CONFIG.url}${PROPERTY_DATA.images[0]}`,
        width: 1200,
        height: 630,
        alt: 'Folks Vila Mariana - Empreendimento para investimento',
      },
    ],
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investir no Folks Vila Mariana — Oportunidade de Investimento',
    description:
      'Studios e apartamentos compactos na Vila Mariana, a partir de R$ 277 mil. Entrega em 2025.',
    images: [
      PROPERTY_DATA.images[0]?.startsWith('http')
        ? PROPERTY_DATA.images[0]
        : `${SITE_CONFIG.url}${PROPERTY_DATA.images[0]}`,
    ],
  },
  other: {
    'geo.region': 'BR-SP',
    'geo.placename': 'Vila Mariana, São Paulo',
    'geo.position': `${PROPERTY_DATA.coordinates.lat};${PROPERTY_DATA.coordinates.lng}`,
    ICBM: `${PROPERTY_DATA.coordinates.lat}, ${PROPERTY_DATA.coordinates.lng}`,
  },
}

// ============================================================================
// FAQ DATA
// ============================================================================
const FAQ_DATA = [
  {
    question: 'Esse empreendimento é bom para renda de aluguel?',
    answer:
      'Sim! O Folks Vila Mariana é excelente para investimento em renda. A localização na Vila Mariana, próxima ao metrô e a principais polos de São Paulo, garante alta demanda de locação. As unidades compactas (17m² a 37m²) são ideais para estudantes, profissionais jovens e pessoas que buscam praticidade e localização privilegiada.',
  },
  {
    question: 'Qual o valor mínimo para investir?',
    answer:
      'O ticket de entrada mínimo é a partir de R$ 277.197* para unidades Studio/NR de 17m². Também há opções de 1 dormitório (37m²) a partir de R$ 538.500 e 2 dormitórios (37m²) a partir de R$ 575.441. Entre em contato para conhecer todas as opções disponíveis e condições de pagamento.',
  },
  {
    question: 'Já está pronto ou ainda em obras?',
    answer:
      'O empreendimento está em obras com entrega prevista para outubro de 2025. Este prazo mais curto é uma vantagem para investidores, pois reduz o tempo de espera e permite começar a gerar renda mais rapidamente após a entrega.',
  },
  {
    question: 'Consigo financiar? Como funciona?',
    answer:
      'Sim, é possível financiar através de programas como Minha Casa Minha Vida (MCMV) ou financiamento imobiliário tradicional. Entre em contato conosco para analisarmos seu perfil e as melhores condições de financiamento disponíveis. Também oferecemos consultoria personalizada para montar a melhor estratégia de investimento.',
  },
  {
    question: 'Qual a localização exata do empreendimento?',
    answer:
      'O Folks Vila Mariana está localizado na Rua Cubatão, 1038, no coração da Vila Mariana, São Paulo/SP. A localização é privilegiada, com fácil acesso ao metrô (estações Ana Rosa, Vila Mariana e Santa Cruz), próximo ao Shopping Santa Cruz, ao Parque Ibirapuera e às principais vias de São Paulo.',
  },
  {
    question: 'Quais são os diferenciais do empreendimento?',
    answer:
      'O Folks Vila Mariana oferece uma completa estrutura de lazer e serviços: academia (Fitness), churrasqueira, salão de festas, espaço gourmet, piscina adulto, solarium, business place e terraço coletivo. Além disso, o empreendimento conta com design moderno, acabamento de alto padrão e a segurança de estar em uma das regiões mais valorizadas de São Paulo.',
  },
]

// ============================================================================
// COMPONENTES DE SEÇÃO
// ============================================================================

function HeroSection() {
  const minPrice = Math.min(...PROPERTY_DATA.units.map((u) => u.price))
  const minArea = Math.min(...PROPERTY_DATA.units.map((u) => u.area))
  const maxArea = Math.max(...PROPERTY_DATA.units.map((u) => u.area))

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.main)}`

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={PROPERTY_DATA.images[0]}
          alt="Folks Vila Mariana - Vista do empreendimento"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              Vila Mariana – São Paulo/SP
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              Entrega em 2025
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ideal para renda e valorização
            </Badge>
          </div>

          {/* Headline */}
          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
            Invista no Folks Vila Mariana, um ativo imobiliário na região mais desejada de São Paulo
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Studios e apartamentos compactos com alta demanda de locação, ao lado do metrô e dos principais polos de São Paulo.
          </p>

          {/* Price and Area Info */}
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
              <p className="text-white/80 text-sm">Ticket de entrada</p>
              <p className="text-2xl font-bold">A partir de R$ {minPrice.toLocaleString('pt-BR')}*</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
              <p className="text-white/80 text-sm">Metragem</p>
              <p className="text-2xl font-bold">
                {minArea} m² a {maxArea} m²
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                Quero analisar esse investimento
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto bg-white/90 text-primary hover:bg-white border-white" asChild>
              <Link href="#materiais">
                <Download className="h-5 w-5 mr-2" />
                Baixar book e tabela de preços
              </Link>
            </Button>
          </div>

          <p className="text-sm text-white/70">*Valores sujeitos a alteração sem aviso prévio</p>
        </div>
      </div>
    </section>
  )
}

function WhyInvestSection() {
  return (
    <section className="py-20 bg-muted/30" aria-labelledby="why-invest-heading">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 id="why-invest-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Por que investir na Vila Mariana?
          </h2>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Vila Mariana é um dos bairros mais estratégicos de São Paulo para investimento imobiliário. Localizada na Zona Sul,
              a região combina infraestrutura completa, excelente localização e alta demanda por locação, tornando-se um ativo de
              grande valorização.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Localização Estratégica</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Próximo ao metrô (estações Ana Rosa, Vila Mariana e Santa Cruz)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Acesso rápido à Avenida Paulista, Centro e Ibirapuera</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Próximo ao Shopping Santa Cruz e principais serviços</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Alta Demanda de Locação</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Perfil diversificado: estudantes, profissionais, médicos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Facilidade de locação (alta liquidez)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Potencial para locação tradicional e temporada</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Alta procura por locação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A região concentra uma grande demanda por imóveis para locação, garantindo baixo tempo de vacância.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Infraestrutura completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comércio, serviços, saúde, educação e lazer completos, tudo a poucos minutos do empreendimento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Potencial de valorização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Região consolidada com histórico de valorização constante e tendência de crescimento contínuo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function InvestmentNumbersSection() {
  const minPrice = Math.min(...PROPERTY_DATA.units.map((u) => u.price))
  const minArea = Math.min(...PROPERTY_DATA.units.map((u) => u.area))
  const maxArea = Math.max(...PROPERTY_DATA.units.map((u) => u.area))

  return (
    <section className="py-20" aria-labelledby="numbers-heading">
      <div className="container">
        <h2 id="numbers-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
          Números do Investimento
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Ticket de Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">R$ {minPrice.toLocaleString('pt-BR')}*</p>
              <p className="text-sm text-muted-foreground mt-2">Unidade Studio/NR 17m²</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Metragem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {minArea} m² a {maxArea} m²
              </p>
              <p className="text-sm text-muted-foreground mt-2">Unidades compactas e funcionais</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Status da Obra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">Em Obras</p>
              <p className="text-sm text-muted-foreground mt-2">Entrega prevista: {PROPERTY_DATA.deliveryDate}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Exemplo de Cenário de Investimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Uma unidade de 37 m² no Folks Vila Mariana pode ser utilizada para{' '}
              <strong>locação residencial tradicional</strong> ou{' '}
              <strong>locação por temporada</strong>, dependendo do perfil do investidor. A localização privilegiada e a
              estrutura completa do empreendimento garantem alta demanda, seja para moradores fixos ou para hospedagem de curta
              duração. O investimento oferece potencial de renda mensal consistente e valorização do ativo ao longo do tempo.
            </p>
            <p className="text-sm text-muted-foreground mt-4 italic">
              *Este é um exemplo ilustrativo. Rentabilidades passadas não garantem resultados futuros. Consulte um consultor
              imobiliário para análise personalizada.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function AboutPropertySection() {
  return (
    <section className="py-20 bg-muted/30" aria-labelledby="about-heading">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Sobre o Empreendimento Folks Vila Mariana
          </h2>

          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">{PROPERTY_DATA.description}</div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Características e Diferenciais</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {PROPERTY_DATA.characteristics.map((char) => (
                <Badge key={char} variant="outline" className="text-base py-2 px-4 justify-center">
                  {char}
                </Badge>
              ))}
            </div>
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Informações do Empreendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Construtora</p>
                  <p className="text-muted-foreground">{PROPERTY_DATA.developer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Localização</p>
                  <p className="text-muted-foreground">
                    {PROPERTY_DATA.address.street}, {PROPERTY_DATA.address.number} - {PROPERTY_DATA.address.district},{' '}
                    {PROPERTY_DATA.address.city}/{PROPERTY_DATA.address.state}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Entrega</p>
                  <p className="text-muted-foreground">{PROPERTY_DATA.deliveryDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  // Primeira imagem é usada no hero, então mostramos as demais na galeria
  const galleryImages = PROPERTY_DATA.images.slice(1)

  return (
    <section className="py-20" aria-labelledby="gallery-heading">
      <div className="container">
        <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold text-center mb-4">
          Galeria / Tour Visual
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Conheça todos os detalhes e ambientes do Folks Vila Mariana
        </p>

        {/* Carrossel Compacto */}
        <div className="max-w-5xl mx-auto mb-8">
          <GalleryCarousel images={galleryImages} />
        </div>

        {PROPERTY_DATA.videoUrl && (
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <a href={PROPERTY_DATA.videoUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-5 w-5 mr-2" />
                Ver vídeo do empreendimento
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function MaterialsSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.materials)}`

  const materials = [
    {
      title: 'Book Digital',
      description: 'Conheça todos os detalhes do empreendimento',
      url: PROPERTY_DATA.bookUrl,
      fileName: 'Book Folks Vila Mariana.pdf',
      type: 'BOOK',
    },
    {
      title: 'Ficha Técnica',
      description: 'Especificações completas do projeto',
      url: PROPERTY_DATA.technicalSheetUrl,
      fileName: 'Ficha Técnica Folks Vila Mariana.pdf',
      type: 'EXTRA_MATERIALS',
    },
    {
      title: 'Tabela de Preços',
      description: 'Valores e condições de pagamento',
      url: PROPERTY_DATA.priceTableUrl,
      fileName: 'Tabela de Preços Folks Vila Mariana.pdf',
      type: 'TABLE',
    },
  ]

  return (
    <section id="materiais" className="py-20 bg-muted/30" aria-labelledby="materials-heading">
      <div className="container">
        <h2 id="materials-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
          Materiais para Investidor
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {materials.map((material, idx) => (
            <Card key={idx} className="flex flex-col">
              <CardHeader>
                <CardTitle>{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                {material.url ? (
                  <DownloadForm
                    materialTitle={material.title}
                    downloadUrl={material.url}
                    fileName={material.fileName}
                  />
                ) : (
                  <Button className="w-full" asChild>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Solicitar via WhatsApp
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.consultation)}`

  return (
    <section className="py-20" aria-labelledby="contact-heading">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Atendimento com Gabriel Alberto
          </h2>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Consultoria Personalizada para Investimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Gabriel Alberto</strong>, corretor de imóveis e consultor imobiliário, CRECI 267769, oferece
                  atendimento personalizado para investidores que buscam maximizar seus resultados no mercado imobiliário.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Com experiência em análise de investimentos imobiliários, Gabriel ajuda você a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                  <li>Analisar o potencial de rentabilidade do imóvel</li>
                  <li>Entender as melhores estratégias de financiamento</li>
                  <li>Montar um plano de investimento personalizado</li>
                  <li>Acompanhar todo o processo de compra</li>
                </ul>
              </div>

              <div className="pt-6">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Agendar consultoria 1:1 via WhatsApp
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  return (
    <section className="py-20 bg-muted/30" aria-labelledby="faq-heading">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perguntas Frequentes sobre Investimento
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================
export default function FolksVilaMarianaPage() {
  // JSON-LD Schemas
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Investir', url: '/investir' },
    { name: 'Folks Vila Mariana', url: '/investir/folks-vila-mariana' },
  ])

  const faqJsonLd = generateFAQJsonLd({ faqs: FAQ_DATA })

  // Residence/ApartmentComplex JSON-LD
  const propertyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: PROPERTY_DATA.name,
    description: PROPERTY_DATA.description.trim(),
    url: `${SITE_CONFIG.url}/investir/folks-vila-mariana`,
    image: PROPERTY_DATA.images.map((img) =>
      img.startsWith('http') ? img : `${SITE_CONFIG.url}${img}`
    ),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${PROPERTY_DATA.address.street}, ${PROPERTY_DATA.address.number}`,
      addressLocality: PROPERTY_DATA.address.district,
      addressRegion: PROPERTY_DATA.address.state,
      postalCode: PROPERTY_DATA.address.zipcode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: PROPERTY_DATA.coordinates.lat,
      longitude: PROPERTY_DATA.coordinates.lng,
    },
    developer: {
      '@type': 'Organization',
      name: PROPERTY_DATA.developer,
    },
    numberOfUnits: PROPERTY_DATA.units.length,
    amenityFeature: PROPERTY_DATA.characteristics.map((char) => ({
      '@type': 'LocationFeatureSpecification',
      name: char,
    })),
  }

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />

      <main>
        <HeroSection />
        <WhyInvestSection />
        <InvestmentNumbersSection />
        <AboutPropertySection />
        <GallerySection />
        <MaterialsSection />
        <ContactSection />
        <FAQSection />
      </main>
    </>
  )
}


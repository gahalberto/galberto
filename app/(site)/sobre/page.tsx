import { Building2, Award, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import { generateOrganizationJsonLd } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description:
    'Conheça a Gabriel Alberto Imóveis, especialista em imóveis de alto padrão em São Paulo.',
  openGraph: {
    title: 'Sobre Nós',
    description:
      'Conheça a Gabriel Alberto Imóveis, especialista em imóveis de alto padrão em São Paulo.',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/imagem-social.png`,
        width: 1200,
        height: 630,
        alt: 'Sobre Nós - Gabriel Alberto Imóveis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nós',
    description:
      'Conheça a Gabriel Alberto Imóveis, especialista em imóveis de alto padrão em São Paulo.',
    images: [`${SITE_CONFIG.url}/images/imagem-social.png`],
  },
}

export default function SobrePage() {
  const organizationJsonLd = generateOrganizationJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Sobre a Gabriel Alberto Imóveis
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Especialistas em imóveis de qualidade em São Paulo
          </p>

          <div className="prose prose-lg max-w-none mb-12">
            <p>
              A <strong>Gabriel Alberto Imóveis</strong> é uma imobiliária
              especializada em conectar pessoas aos imóveis dos sonhos em São
              Paulo. Com anos de experiência no mercado imobiliário, oferecemos
              um portfólio exclusivo de lançamentos, apartamentos prontos e
              oportunidades únicas de investimento.
            </p>
            <p>
              Nossa missão é proporcionar a melhor experiência na busca pelo
              imóvel ideal, oferecendo atendimento personalizado, transparência
              e conhecimento profundo do mercado paulistano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Experiência</h3>
                <p className="text-muted-foreground">
                  Anos de experiência no mercado imobiliário de São Paulo
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Portfólio Exclusivo
                </h3>
                <p className="text-muted-foreground">
                  Acesso aos melhores lançamentos e imóveis premium
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Atendimento Personalizado
                </h3>
                <p className="text-muted-foreground">
                  Consultoria especializada para cada cliente
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Comprometimento</h3>
                <p className="text-muted-foreground">
                  Dedicação total para realizar seu sonho
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Vamos encontrar seu imóvel ideal?
            </h2>
            <p className="text-xl mb-6 text-blue-100">
              Entre em contato e descubra como podemos ajudar
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contato">Fale conosco</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

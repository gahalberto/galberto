import { Building2, Award, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import { generateOrganizationJsonLd } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/constants'
import { GabrielProfileImage } from '@/components/gabriel-profile-image'

export const metadata: Metadata = {
  title: 'Sobre Nós | Gabriel Alberto - Consultor Imobiliário em São Paulo',
  description:
    'Conheça Gabriel Alberto, consultor imobiliário CRECI 267769 especializado em compra de imóveis e investimento imobiliário em São Paulo. Atendimento personalizado estilo buyer\'s agent.',
  keywords: [
    'consultor imobiliário São Paulo',
    'Gabriel Alberto imóveis',
    'CRECI 267769',
    'buyer\'s agent São Paulo',
    'investimento imobiliário',
    'compra de imóveis São Paulo',
  ],
  openGraph: {
    title: 'Sobre Nós | Gabriel Alberto - Consultor Imobiliário',
    description:
      'Consultor imobiliário especializado em moradia e investimento imobiliário em São Paulo. Atendimento personalizado estilo buyer\'s agent.',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/imagem-social.png`,
        width: 1200,
        height: 630,
        alt: 'Gabriel Alberto - Consultor Imobiliário em São Paulo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nós | Gabriel Alberto - Consultor Imobiliário',
    description:
      'Consultor imobiliário especializado em moradia e investimento imobiliário em São Paulo.',
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
          {/* Seção Sobre Mim - Gabriel Alberto */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-8">
              {/* Foto do Corretor */}
              <GabrielProfileImage />

              {/* Texto Sobre Mim */}
              <div className="space-y-6">
                {/* Headline */}
                <div className="space-y-4">
                  <p className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                    O atendimento que você merece começa com empatia e estratégia.
                  </p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      CRECI 267769
                    </span>
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      Consultor Imobiliário
                    </span>
                  </div>
                </div>

                {/* Parágrafo 1 */}
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Sou <strong>Gabriel Alberto</strong>, consultor imobiliário nascido em Santos e formado pela experiência internacional no mercado imobiliário. Minha jornada me ensinou que cada imóvel tem uma história, e cada cliente tem um sonho. Meu papel é transformar esse sonho em um investimento seguro e inteligente, seja para morar ou para multiplicar patrimônio.
                </p>

                {/* Parágrafo 2 */}
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Trabalho com um modelo único de atendimento personalizado, inspirado no conceito de <strong>buyer's agent</strong>. Isso significa que você não está sozinho nessa jornada. Acompanho cada etapa do processo: desde a primeira conversa até a entrega das chaves, passando por análise de mercado, negociação estratégica e toda a burocracia necessária. Minha experiência internacional me trouxe uma visão ampla do mercado imobiliário, que aplico diariamente para encontrar as melhores oportunidades em São Paulo.
                </p>

                {/* Parágrafo 3 */}
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Especialista em moradia e <strong>investimento imobiliário</strong>, meu foco é entender profundamente o seu perfil, suas necessidades e seus objetivos. Não trabalho com pressão ou abordagens agressivas. Trabalho com estratégia, transparência e dedicação para fechar o melhor negócio possível. Seja seu primeiro apartamento, uma casa para a família ou um investimento com retorno garantido, estou aqui para fazer a diferença na sua jornada imobiliária.
                </p>

                {/* CTA */}
                <div className="pt-4">
                  <p className="text-xl font-semibold mb-4">
                    Vamos conversar sobre seu próximo imóvel?
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/contato">
                      Entre em contato e descubra como posso ajudar
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Separador */}
          <div className="border-t my-16"></div>

          {/* Seção Sobre a Empresa */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Sobre a Gabriel Alberto Imóveis
            </h2>
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
          </section>

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

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export function HeroAstroKlabin() {
  // TODO: Trocar pela imagem real do empreendimento
  const heroImage = '/images/astro/astro-klabin-hero.jpg'
  
  // TODO: Adicionar link do WhatsApp
  const whatsappLink = 'https://wa.me/5511994917885?text=Olá!%20Tenho%20interesse%20no%20Astro%20Klabin'

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Astro Klabin - Empreendimento na Chácara Klabin"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay em degradê para melhorar legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-white space-y-6 lg:space-y-8">
            {/* Badge de Lançamento */}
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground text-sm md:text-base px-4 py-2"
            >
              LANÇAMENTO
            </Badge>

            {/* Logo do Empreendimento */}
            <div className="relative w-full max-w-[180px] md:max-w-[220px] lg:max-w-[260px]">
              <Image
                src="/images/astro/logo_astro_original.svg"
                alt="Astro Klabin"
                width={150}
                height={90}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Headline Principal */}
            <h1
              id="hero-title"
              className="text-4xl md:text-5xl lg:text-6xl  leading-tight font-montserrat font-extralight"
            >
              Viva na <span className="font-bold">Chácara Klabin</span> com o melhor preço!
            </h1>

            {/* Price Card + CTA */}
            <div className="pt-4">
              <Card className="bg-yellow-500/95 backdrop-blur-sm rounded-md shadow-2xl border-0">
                <CardContent className="p-6 md:p-8 space-y-6">
                  {/* Título do Bloco de Preço */}
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      melhor preço da Chácara Klabin
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      Unidades a partir de:
                    </p>
                  </div>

                  {/* Preços */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-primary text-black font-montserrat">
                        2 DORMS: R$ 699 mil*
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-bold text-primary text-black font-montserrat">
                        3 DORMS: R$ 899 mil**
                      </p>
                    </div>
                  </div>

                  {/* Observações dos asteriscos */}
                  <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                    <p>* Condições especiais para 2 dormitórios</p>
                    <p>** Condições especiais para 3 dormitórios</p>
                  </div>

                  {/* CTA Principal */}
                  <div className="pt-4 space-y-3">
                    <Button
                      size="lg"
                      className="w-full text-lg md:text-xl py-6 md:py-7 font-bold shadow-lg hover:shadow-xl transition-all"
                      asChild
                    >
                      <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        Fale agora com um corretor!
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


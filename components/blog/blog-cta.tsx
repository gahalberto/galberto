import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function BlogCTA() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 my-8">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">
            Pronto para encontrar seu imóvel ideal?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entre em contato comigo e descubra as melhores oportunidades de
            investimento imobiliário em São Paulo. Estou aqui para ajudar você a
            realizar seu sonho.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
              asChild
            >
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Olá Gabriel! Vi seu artigo e gostaria de mais informações sobre imóveis.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}>
                <Phone className="mr-2 h-5 w-5" />
                Ligar Agora
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            Atendimento de segunda a sexta, 9h às 18h
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


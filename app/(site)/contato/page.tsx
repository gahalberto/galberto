import { Mail, Phone, MapPin } from 'lucide-react'
import { LeadForm } from '@/components/lead-form'
import { SITE_CONFIG } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com a Gabriel Alberto Imóveis. Estamos prontos para ajudá-lo a encontrar o imóvel perfeito.',
  openGraph: {
    title: 'Contato',
    description:
      'Entre em contato com a Gabriel Alberto Imóveis. Estamos prontos para ajudá-lo a encontrar o imóvel perfeito.',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/imagem-social.png`,
        width: 1200,
        height: 630,
        alt: 'Contato - Gabriel Alberto Imóveis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato',
    description:
      'Entre em contato com a Gabriel Alberto Imóveis. Estamos prontos para ajudá-lo a encontrar o imóvel perfeito.',
    images: [`${SITE_CONFIG.url}/images/imagem-social.png`],
  },
}

export default function ContatoPage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-muted-foreground">
            Estamos prontos para ajudá-lo a encontrar o imóvel perfeito
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Nossa Localização</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
                      {SITE_CONFIG.address.street}, {SITE_CONFIG.address.number}
                      <br />
                      {SITE_CONFIG.address.district} -{' '}
                      {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}
                      <br />
                      CEP: {SITE_CONFIG.address.zipcode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <p className="text-muted-foreground">{SITE_CONFIG.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-mail</h3>
                    <p className="text-muted-foreground">{SITE_CONFIG.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Horário de Atendimento</h2>
              <div className="text-muted-foreground space-y-1">
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 13h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <div>
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  )
}

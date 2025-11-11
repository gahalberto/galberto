import Link from 'next/link'
import { Building2, Instagram, Facebook, Linkedin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold">Gabriel Alberto Imóveis</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Encontre o imóvel perfeito em São Paulo. Lançamentos, apartamentos
              prontos e oportunidades para investimento.
            </p>
            <div className="flex space-x-4">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/imoveis"
                  className="text-muted-foreground hover:text-primary"
                >
                  Todos os Imóveis
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?status=LANCAMENTO"
                  className="text-muted-foreground hover:text-primary"
                >
                  Lançamentos
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?status=PRONTO"
                  className="text-muted-foreground hover:text-primary"
                >
                  Prontos
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?airbnb=true"
                  className="text-muted-foreground hover:text-primary"
                >
                  Ideais para Airbnb
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sobre"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/bairros"
                  className="text-muted-foreground hover:text-primary"
                >
                  Guia de Bairros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{SITE_CONFIG.phone}</li>
              <li>{SITE_CONFIG.email}</li>
              <li>
                {SITE_CONFIG.address.street}, {SITE_CONFIG.address.number}
              </li>
              <li>
                {SITE_CONFIG.address.district} - {SITE_CONFIG.address.city}/{SITE_CONFIG.address.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}


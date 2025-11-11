import Link from 'next/link'
import { Building2, Instagram, Facebook, Linkedin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold">Gabriel Alberto</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Encontre o imóvel perfeito em São Paulo
            </p>
            <div className="flex gap-3">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/imoveis"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Imóveis
                </Link>
              </li>
              <li>
                <Link
                  href="/bairros"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bairros
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tipos de Imóvel</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/imoveis?status=LANCAMENTO"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Lançamentos
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?status=PRONTO"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Prontos para Morar
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?allowAirbnb=true"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Permite Airbnb
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{SITE_CONFIG.phone}</li>
              <li>{SITE_CONFIG.email}</li>
              <li>
                {SITE_CONFIG.address.street}, {SITE_CONFIG.address.number}
                <br />
                {SITE_CONFIG.address.district} - {SITE_CONFIG.address.city},{' '}
                {SITE_CONFIG.address.state}
              </li>
              <li className="font-medium text-foreground">CRECI: 267769</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos
            reservados.
          </p>
          <p className="mt-2 font-medium text-foreground">CRECI: 267769</p>
        </div>
      </div>
    </footer>
  )
}

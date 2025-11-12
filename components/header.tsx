'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'
import { useState } from 'react'

export function Header() {
  const [logoError, setLogoError] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full" style={{ backgroundColor: '#22313A', borderBottom: '1px solid #22313A' }}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {!logoError ? (
            <Image
              src="/images/logos/logo-ouro.png"
              alt={SITE_CONFIG.name}
              width={200}
              height={50}
              className="h-12 w-auto object-contain"
              priority
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="font-bold text-xl text-white">
              {SITE_CONFIG.name}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-montserrat">
          <Link
            href="/imoveis"
            className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E] flex items-center gap-1 group"
          >
            Imóveis
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </Link>
          <Link
            href="/bairros"
            className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E] flex items-center gap-1 group"
          >
            Bairros
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E] flex items-center gap-1 group"
          >
            Blog
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E] flex items-center gap-1 group"
          >
            Sobre
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E] flex items-center gap-1 group"
          >
            Contato
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </Link>
          <span className="text-xs text-white/70 font-medium">
            CRECI: 267769
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            asChild 
            className="hidden sm:flex"
            style={{ 
              backgroundColor: '#E9CF7E',
              color: '#22313A'
            }}
          >
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: '#22313A' }}>
          <nav className="container flex flex-col space-y-3 py-4 font-montserrat">
            <Link
              href="/imoveis"
              className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Imóveis
            </Link>
            <Link
              href="/bairros"
              className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bairros
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/sobre"
              className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-sm font-medium text-white transition-colors hover:text-[#E9CF7E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            <div className="pt-2 border-t border-white/20">
              <span className="text-xs text-white/70 font-medium">CRECI: 267769</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

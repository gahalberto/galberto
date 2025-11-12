'use client'

import Link from 'next/link'
import { Building2, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Gabriel Alberto Imóveis</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/imoveis"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Imóveis
          </Link>
          <Link
            href="/bairros"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Bairros
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Sobre
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/imoveis">
              <Search className="mr-2 h-4 w-4" />
              Buscar Imóveis
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden border-t',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <nav className="container flex flex-col space-y-3 py-4">
          <Link
            href="/imoveis"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Imóveis
          </Link>
          <Link
            href="/bairros"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Bairros
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sobre
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contato
          </Link>
        </nav>
      </div>
    </header>
  )
}


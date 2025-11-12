'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Home, MapPin, Users, Settings, LogOut, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

interface AdminNavProps {
  user: any
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/imoveis', label: 'Imóveis', icon: Building2 },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/bairros', label: 'Bairros', icon: MapPin },
    { href: '/admin/leads', label: 'Leads', icon: Users },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Admin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}


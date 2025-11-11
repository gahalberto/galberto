'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, LogOut, Home } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/imoveis"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Imóveis
            </Link>
            <Link
              href="/admin/leads"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Leads
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user.email}
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Site
            </Link>
          </Button>
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


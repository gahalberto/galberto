'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Olá! Tenho interesse em conhecer os imóveis disponíveis.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-green-500 shadow-lg transition-all hover:bg-green-600 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Falar no WhatsApp</span>
      </Button>
    </a>
  )
}


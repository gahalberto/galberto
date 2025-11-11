'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'

export function WhatsAppButton() {
  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg"
      asChild
    >
      <a
        href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Olá! Gostaria de mais informações sobre os imóveis.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </Button>
  )
}


'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Olá! Gostaria de mais informações sobre os imóveis.'
    )
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsapp}?text=${message}`,
      '_blank'
    )
  }

  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
      onClick={handleWhatsAppClick}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">WhatsApp</span>
    </Button>
  )
}


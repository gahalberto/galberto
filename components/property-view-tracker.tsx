'use client'

import { useEffect } from 'react'
import { trackPropertyView } from './google-analytics'

interface PropertyViewTrackerProps {
  slug: string
  title: string
}

export function PropertyViewTracker({ slug, title }: PropertyViewTrackerProps) {
  useEffect(() => {
    // Rastrear visualização do imóvel quando o componente montar
    trackPropertyView(slug, title)
  }, [slug, title])

  return null // Componente não renderiza nada
}


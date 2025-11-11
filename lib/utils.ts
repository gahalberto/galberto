import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number | string | null | undefined): string {
  if (!value) return 'Consulte'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue)
}

export function formatArea(value: number | string | null | undefined): string {
  if (!value) return '-'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return `${numValue.toLocaleString('pt-BR')} m²`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/--+/g, '-') // replace multiple - with single -
    .trim()
}

export function getPropertyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    LANCAMENTO: 'Lançamento',
    EM_OBRAS: 'Em Obras',
    PRONTO: 'Pronto',
  }
  return labels[status] || status
}

export function getPropertyPurposeLabel(purpose: string): string {
  const labels: Record<string, string> = {
    VENDA: 'Venda',
    ALUGUEL: 'Aluguel',
  }
  return labels[purpose] || purpose
}

/**
 * Calcula distância entre dois pontos (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Extrai UTM parameters da URL
 */
export function getUtmParams(url: string): Record<string, string> | null {
  try {
    const urlObj = new URL(url)
    const utmParams: Record<string, string> = {}
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    
    utmKeys.forEach(key => {
      const value = urlObj.searchParams.get(key)
      if (value) utmParams[key] = value
    })
    
    return Object.keys(utmParams).length > 0 ? utmParams : null
  } catch {
    return null
  }
}

/**
 * Gera excerpt de texto
 */
export function excerpt(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}


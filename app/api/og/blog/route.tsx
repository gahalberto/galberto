import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { SITE_CONFIG } from '@/lib/constants'

// Edge runtime não suporta Prisma diretamente
// Usaremos query params para passar os dados
export const runtime = 'edge'

const categoryLabels: Record<string, string> = {
  INVESTIMENTOS: 'Investimentos',
  MERCADO_IMOBILIARIO: 'Mercado Imobiliário',
  FINANCIAMENTOS: 'Financiamentos',
  DICAS_COMPRADORES: 'Dicas para Compradores',
  VALORIZACAO_BAIRROS: 'Valorização por Bairro',
  TENDENCIAS: 'Tendências',
  GUIA_COMPRADOR: 'Guia do Comprador',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Blog - Gabriel Alberto Imóveis'
    const excerpt = searchParams.get('excerpt') || 'Dicas e notícias sobre o mercado imobiliário em São Paulo'
    const category = searchParams.get('category') || 'Blog'
    const author = searchParams.get('author') || 'Gabriel Alberto'

    const excerptShort = excerpt.slice(0, 120) + (excerpt.length > 120 ? '...' : '')
    const categoryLabel = categoryLabels[category] || category

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #22313A 0%, #1a2832 100%)',
            padding: '60px 80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#E9CF7E',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                📝
              </div>
              <span
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                {SITE_CONFIG.name}
              </span>
            </div>
            <div
              style={{
                background: 'rgba(233, 207, 126, 0.2)',
                borderRadius: '8px',
                padding: '8px 16px',
                border: '1px solid rgba(233, 207, 126, 0.3)',
              }}
            >
              <span
                style={{
                  color: '#E9CF7E',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {categoryLabel}
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                color: 'white',
                fontSize: '64px',
                fontWeight: 'bold',
                lineHeight: 1.2,
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '28px',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {excerptShort}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✍️</span>
              <span>{author}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍</span>
              <span>São Paulo, Brasil</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating blog OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}


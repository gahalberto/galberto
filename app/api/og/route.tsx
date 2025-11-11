import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get('title') || 'Gabriel Alberto Imóveis'
    const subtitle =
      searchParams.get('subtitle') || 'Imóveis de qualidade em São Paulo'
    const price = searchParams.get('price')

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
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            padding: '60px 80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Logo/Brand */}
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
                background: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🏢
            </div>
            <span
              style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              Gabriel Alberto Imóveis
            </span>
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
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
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '32px',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
            {price && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content',
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: 'bold',
                  }}
                >
                  {price}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '24px',
            }}
          >
            <span>📍</span>
            <span>São Paulo, Brasil</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}

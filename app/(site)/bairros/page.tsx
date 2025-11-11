import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export const revalidate = 7200 // 2 hours

export const metadata: Metadata = {
  title: 'Bairros de São Paulo',
  description:
    'Conheça os principais bairros de São Paulo e encontre o imóvel ideal para você.',
  openGraph: {
    title: 'Bairros de São Paulo',
    description:
      'Conheça os principais bairros de São Paulo e encontre o imóvel ideal para você.',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/imagem-social.png`,
        width: 1200,
        height: 630,
        alt: 'Bairros de São Paulo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bairros de São Paulo',
    description:
      'Conheça os principais bairros de São Paulo e encontre o imóvel ideal para você.',
    images: [`${SITE_CONFIG.url}/images/imagem-social.png`],
  },
}

async function getNeighborhoods() {
  const neighborhoods = await db.neighborhood.findMany({
    where: { published: true },
    orderBy: { name: 'asc' },
  })

  return neighborhoods
}

export default async function BairrosPage() {
  const neighborhoods = await getNeighborhoods()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bairros de São Paulo</h1>
        <p className="text-muted-foreground text-lg">
          Explore os principais bairros da cidade e descubra o melhor lugar para
          você
        </p>
      </div>

      {neighborhoods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood) => (
            <Link key={neighborhood.id} href={`/bairros/${neighborhood.slug}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {neighborhood.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {neighborhood.summary ||
                      'Descubra mais sobre este bairro'}
                  </p>
                  {neighborhood.avgPrice && (
                    <p className="text-sm font-semibold text-primary mt-4">
                      Preço médio: R${' '}
                      {parseFloat(neighborhood.avgPrice.toString()).toLocaleString(
                        'pt-BR'
                      )}
                      /m²
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Nenhum bairro cadastrado ainda.
          </p>
        </div>
      )}
    </div>
  )
}

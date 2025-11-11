import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'

export async function GET() {
  const baseUrl = SITE_CONFIG.url

  // Get all published properties with coordinates
  const properties = await db.property.findMany({
    where: {
      published: true,
      lat: { not: null },
      lng: { not: null },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      lat: true,
      lng: true,
      price: true,
      address: {
        select: {
          district: true,
          city: true,
          neighborhood: {
            select: {
              name: true,
              city: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Gabriel Alberto Imóveis - Mapa de Imóveis</name>
    <description>Localização de todos os imóveis disponíveis</description>
    <Style id="property-icon">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>
${properties
  .map(
    (property) => `    <Placemark>
      <name>${escapeXml(property.title)}</name>
      <description><![CDATA[
        <strong>${escapeXml(property.title)}</strong><br/>
        ${property.address?.neighborhood?.name || property.address?.district || 'São Paulo'}, ${property.address?.neighborhood?.city?.name || property.address?.city || 'São Paulo'}<br/>
        ${property.price ? `Preço: R$ ${parseFloat(property.price.toString()).toLocaleString('pt-BR')}` : 'Consulte'}
        <br/><br/>
        <a href="${baseUrl}/imoveis/${property.slug}">Ver detalhes</a>
      ]]></description>
      <styleUrl>#property-icon</styleUrl>
      <Point>
        <coordinates>${property.lng},${property.lat},0</coordinates>
      </Point>
    </Placemark>`
  )
  .join('\n')}
  </Document>
</kml>`

  return new Response(kml, {
    headers: {
      'Content-Type': 'application/vnd.google-earth.kml+xml',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

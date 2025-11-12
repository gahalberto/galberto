import { SITE_CONFIG } from './constants'

interface JsonLdBase {
  '@context': string
  '@type': string
}

export function generateWebSiteJsonLd(): JsonLdBase & Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/imoveis?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateOrganizationJsonLd(): JsonLdBase & Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.number}`,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.zipcode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.geo.lat,
      longitude: SITE_CONFIG.geo.lng,
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.linkedin,
    ],
  }
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): JsonLdBase & Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  }
}

interface PropertyJsonLdProps {
  property: {
    title: string
    description: string
    slug: string
    price?: number | string | null
    purpose: string
    bedrooms?: number | null
    bathrooms?: number | null
    areaPrivate?: number | string | null
    areaTotal?: number | string | null
    lat?: number | null
    lng?: number | null
    address: {
      street: string
      number?: string | null
      district: string
      city: string
      state: string
      zipcode: string
      country: string
    }
    images: { url: string }[]
    amenities?: { amenity: { name: string } }[]
  }
}

export function generatePropertyJsonLd({
  property,
}: PropertyJsonLdProps): JsonLdBase & Record<string, any> {
  const propertyUrl = `${SITE_CONFIG.url}/imoveis/${property.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: property.images.map((img) => img.url),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${property.address.street}${property.address.number ? ', ' + property.address.number : ''}`,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.zipcode,
      addressCountry: 'BR',
    },
    ...(property.lat &&
      property.lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: property.lat,
          longitude: property.lng,
        },
      }),
    ...(property.areaPrivate && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.areaPrivate,
        unitCode: 'MTK',
      },
    }),
    ...(property.bedrooms && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms && {
      numberOfBathroomsTotal: property.bathrooms,
    }),
    ...(property.amenities &&
      property.amenities.length > 0 && {
        amenityFeature: property.amenities.map((a) => ({
          '@type': 'LocationFeatureSpecification',
          name: a.amenity.name,
        })),
      }),
    offers: {
      '@type': 'Offer',
      price: property.price || 0,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      ...(property.purpose === 'VENDA'
        ? { priceValidUntil: new Date().toISOString() }
        : {}),
    },
  }
}

interface NeighborhoodJsonLdProps {
  neighborhood: {
    name: string
    slug: string
    city: string
    state: string
    lat?: number | null
    lng?: number | null
    summary?: string | null
  }
}

export function generateNeighborhoodJsonLd({
  neighborhood,
}: NeighborhoodJsonLdProps): JsonLdBase & Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: neighborhood.name,
    description: neighborhood.summary,
    url: `${SITE_CONFIG.url}/bairros/${neighborhood.slug}`,
    ...(neighborhood.lat &&
      neighborhood.lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: neighborhood.lat,
          longitude: neighborhood.lng,
        },
      }),
    containedInPlace: {
      '@type': 'City',
      name: neighborhood.city,
      containedInPlace: {
        '@type': 'State',
        name: neighborhood.state,
      },
    },
  }
}

export function generateArticleJsonLd(article: {
  title: string
  description: string
  slug: string
  author: string
  publishedAt: Date
  image?: string
}): JsonLdBase & Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${SITE_CONFIG.url}/blog/${article.slug}`,
    datePublished: article.publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    ...(article.image && { image: article.image }),
  }
}

interface BlogPostJsonLdProps {
  post: {
    id: string
    title: string
    excerpt: string
    slug: string
    author: string
    authorBio?: string | null
    publishedAt: Date | null
    coverImage?: string | null
    category: string
    keywords?: string[]
    updatedAt: Date
  }
}

export function generateBlogPostJsonLd({
  post,
}: BlogPostJsonLdProps): JsonLdBase & Record<string, any> {
  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : `${SITE_CONFIG.url}${post.coverImage}`
    : `${SITE_CONFIG.url}/images/imagem-social.png`

  const baseJsonLd: JsonLdBase & Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    image: imageUrl,
    datePublished: post.publishedAt?.toISOString() || new Date().toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      ...(post.authorBio && { description: post.authorBio }),
      sameAs: [
        SITE_CONFIG.social.instagram,
        SITE_CONFIG.social.linkedin,
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logos/logo-ouro.png`,
      },
      sameAs: [
        SITE_CONFIG.social.instagram,
        SITE_CONFIG.social.facebook,
        SITE_CONFIG.social.linkedin,
      ],
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Mercado Imobiliário',
      description: 'Informações sobre investimentos imobiliários, mercado imobiliário em São Paulo e dicas para compradores',
    },
    ...(post.keywords && post.keywords.length > 0 && {
      keywords: post.keywords.join(', '),
    }),
    inLanguage: SITE_CONFIG.locale,
    articleSection: post.category,
  }

  return baseJsonLd
}

interface FAQJsonLdProps {
  faqs: Array<{ question: string; answer: string }>
}

export function generateFAQJsonLd({
  faqs,
}: FAQJsonLdProps): JsonLdBase & Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}


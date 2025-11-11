export const SITE_CONFIG = {
  name: 'Gabriel Alberto Imóveis',
  description:
    'Encontre o imóvel perfeito em São Paulo. Lançamentos, apartamentos prontos e oportunidades para Airbnb.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'pt-BR',
  alternateLocale: 'en',
  author: 'Gabriel Alberto',
  email: 'contato@gabrielalbertoimoveis.com.br',
  phone: '+55 11 99999-9999',
  whatsapp: '5511999999999',
  address: {
    street: 'Av. Paulista',
    number: '1000',
    district: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipcode: '01310-100',
    country: 'Brasil',
  },
  social: {
    instagram: 'https://instagram.com/gabrielalbertoimoveis',
    facebook: 'https://facebook.com/gabrielalbertoimoveis',
    linkedin: 'https://linkedin.com/company/gabrielalbertoimoveis',
  },
  geo: {
    region: 'BR-SP',
    placename: 'São Paulo',
    position: '-23.5505,-46.6333',
    lat: -23.5505,
    lng: -46.6333,
  },
}

export const PROPERTY_FILTERS = {
  purposes: [
    { value: 'VENDA', label: 'Venda' },
    { value: 'ALUGUEL', label: 'Aluguel' },
  ],
  statuses: [
    { value: 'LANCAMENTO', label: 'Lançamento' },
    { value: 'EM_OBRAS', label: 'Em Obras' },
    { value: 'PRONTO', label: 'Pronto' },
  ],
  bedrooms: [
    { value: '1', label: '1 quarto' },
    { value: '2', label: '2 quartos' },
    { value: '3', label: '3 quartos' },
    { value: '4', label: '4+ quartos' },
  ],
  parkingSpots: [
    { value: '1', label: '1 vaga' },
    { value: '2', label: '2 vagas' },
    { value: '3', label: '3+ vagas' },
  ],
  priceRanges: [
    { value: '0-300000', label: 'Até R$ 300 mil' },
    { value: '300000-500000', label: 'R$ 300 mil - R$ 500 mil' },
    { value: '500000-800000', label: 'R$ 500 mil - R$ 800 mil' },
    { value: '800000-1200000', label: 'R$ 800 mil - R$ 1,2 mi' },
    { value: '1200000-2000000', label: 'R$ 1,2 mi - R$ 2 mi' },
    { value: '2000000-999999999', label: 'Acima de R$ 2 mi' },
  ],
  sortOptions: [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'area-desc', label: 'Maior área' },
  ],
}

export const REVALIDATE_TIME = {
  PROPERTY: 3600, // 1 hour
  LISTING: 1800, // 30 minutes
  NEIGHBORHOOD: 7200, // 2 hours
  HOME: 600, // 10 minutes
}


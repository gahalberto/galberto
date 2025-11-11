/**
 * Seed para popular o banco de dados com dados iniciais
 * 
 * ⚠️ IMPORTANTE: Antes de executar este seed, certifique-se de:
 * 1. Ter aplicado as migrações: pnpm prisma migrate dev
 * 2. Ter gerado o Prisma Client: pnpm prisma generate
 * 
 * Execute com: pnpm prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gabrielalbertoimoveis.com.br'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const hashedPassword = await hash(adminPassword, 10)

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log(`✅ Usuário admin criado: ${user.email}`)

  // Create amenities
  const amenitiesData = [
    { name: 'Piscina', icon: '🏊', category: 'lazer' },
    { name: 'Academia', icon: '💪', category: 'lazer' },
    { name: 'Salão de Festas', icon: '🎉', category: 'lazer' },
    { name: 'Churrasqueira', icon: '🍖', category: 'lazer' },
    { name: 'Playground', icon: '🎠', category: 'lazer' },
    { name: 'Quadra Esportiva', icon: '⚽', category: 'lazer' },
    { name: 'Sauna', icon: '♨️', category: 'lazer' },
    { name: 'Portaria 24h', icon: '🛡️', category: 'seguranca' },
    { name: 'Segurança', icon: '👮', category: 'seguranca' },
    { name: 'Elevador', icon: '🛗', category: 'comodidade' },
    { name: 'Garagem Coberta', icon: '🚗', category: 'comodidade' },
  ]

  const amenities = await Promise.all(
    amenitiesData.map((amenity) =>
      prisma.amenity.upsert({
        where: { name: amenity.name },
        update: {},
        create: amenity,
      })
    )
  )

  console.log(`✅ ${amenities.length} amenities criadas`)

  // Create states (todos os 27 estados brasileiros)
  console.log('📍 Criando estados brasileiros...')
  const estadosData = [
    { name: 'Acre', code: 'AC' },
    { name: 'Alagoas', code: 'AL' },
    { name: 'Amapá', code: 'AP' },
    { name: 'Amazonas', code: 'AM' },
    { name: 'Bahia', code: 'BA' },
    { name: 'Ceará', code: 'CE' },
    { name: 'Distrito Federal', code: 'DF' },
    { name: 'Espírito Santo', code: 'ES' },
    { name: 'Goiás', code: 'GO' },
    { name: 'Maranhão', code: 'MA' },
    { name: 'Mato Grosso', code: 'MT' },
    { name: 'Mato Grosso do Sul', code: 'MS' },
    { name: 'Minas Gerais', code: 'MG' },
    { name: 'Pará', code: 'PA' },
    { name: 'Paraíba', code: 'PB' },
    { name: 'Paraná', code: 'PR' },
    { name: 'Pernambuco', code: 'PE' },
    { name: 'Piauí', code: 'PI' },
    { name: 'Rio de Janeiro', code: 'RJ' },
    { name: 'Rio Grande do Norte', code: 'RN' },
    { name: 'Rio Grande do Sul', code: 'RS' },
    { name: 'Rondônia', code: 'RO' },
    { name: 'Roraima', code: 'RR' },
    { name: 'Santa Catarina', code: 'SC' },
    { name: 'São Paulo', code: 'SP' },
    { name: 'Sergipe', code: 'SE' },
    { name: 'Tocantins', code: 'TO' },
  ]

  const states = await Promise.all(
    estadosData.map((estado) =>
      prisma.state.upsert({
        where: { code: estado.code },
        update: {},
        create: {
          name: estado.name,
          code: estado.code,
        },
      })
    )
  )

  console.log(`✅ ${states.length} estados criados`)

  // Nota: Cidades, Regiões e Bairros serão inseridos via SQL
  // Buscar um bairro existente para os imóveis de exemplo (ou criar um temporário)
  console.log('📝 Nota: Cidades, Regiões e Bairros devem ser inseridos via SQL antes de executar este seed')
  
  // Buscar um bairro existente para usar nos imóveis de exemplo
  const sampleNeighborhood = await prisma.neighborhood.findFirst({
    where: { published: true },
  })

  if (!sampleNeighborhood) {
    console.warn('⚠️ Nenhum bairro encontrado. Os imóveis de exemplo não serão criados.')
    console.warn('⚠️ Execute o SQL de inserção de bairros primeiro.')
  }

  // Create addresses and properties
  const propertiesData = [
    {
      title: 'Apartamento Moderno no Jardins',
      slug: 'apartamento-moderno-jardins',
      description:
        'Apartamento de alto padrão completamente reformado, com acabamentos premium e localização privilegiada no coração dos Jardins. Perfeito para quem busca sofisticação e conforto.',
      status: 'PRONTO' as const,
      purpose: 'VENDA' as const,
      price: 2500000,
      condoFee: 2800,
      iptuYearly: 18000,
      areaTotal: 180,
      areaPrivate: 150,
      bedrooms: 3,
      suites: 2,
      bathrooms: 3,
      parkingSpots: 2,
      floor: 8,
      yearBuilt: 2018,
      allowAirbnb: false,
      highlights: [
        'Vista panorâmica',
        'Cozinha planejada',
        'Piso em porcelanato',
        'Closet no quarto principal',
        'Varanda gourmet',
      ],
      lat: -23.5615,
      lng: -46.6693,
      developer: 'Construtora Premium',
      featured: true,
      published: true,
      address: {
        street: 'Rua Augusta',
        streetNumber: '1500',
        neighborhoodSlug: 'jardins',
        complement: null,
        postalCode: '01304-001',
        lat: -23.5615,
        lng: -46.6693,
        // Legacy fields (preservados para compatibilidade)
        district: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '01304-001',
        country: 'Brasil',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
          alt: 'Sala de estar',
          width: 1200,
          height: 800,
          position: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
          alt: 'Cozinha',
          width: 1200,
          height: 800,
          position: 1,
        },
      ],
      amenityNames: ['Piscina', 'Academia', 'Portaria 24h', 'Elevador'],
    },
    {
      title: 'Lançamento Vila Mariana - Studio Compacto',
      slug: 'lancamento-vila-mariana-studio',
      description:
        'Studio moderno e funcional em lançamento na Vila Mariana. Ideal para investidores ou jovens profissionais. Localização privilegiada próxima ao metrô.',
      status: 'LANCAMENTO' as const,
      purpose: 'VENDA' as const,
      price: 450000,
      condoFee: 600,
      iptuYearly: 3500,
      areaTotal: 35,
      areaPrivate: 28,
      bedrooms: 1,
      suites: 0,
      bathrooms: 1,
      parkingSpots: 1,
      floor: 5,
      deliveryDate: new Date('2025-12-01'),
      allowAirbnb: true,
      highlights: [
        'Próximo ao metrô',
        'Planta otimizada',
        'Entrega em 2025',
        'Permite Airbnb',
      ],
      lat: -23.5882,
      lng: -46.6390,
      developer: 'Construtora Moderna',
      featured: true,
      published: true,
      address: {
        street: 'Rua Domingos de Morais',
        streetNumber: '2500',
        neighborhoodSlug: 'vila-mariana',
        complement: null,
        postalCode: '04036-100',
        lat: -23.5882,
        lng: -46.6390,
        // Legacy fields
        district: 'Vila Mariana',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '04036-100',
        country: 'Brasil',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
          alt: 'Studio moderno',
          width: 1200,
          height: 800,
          position: 0,
        },
      ],
      amenityNames: ['Academia', 'Portaria 24h', 'Elevador'],
    },
    {
      title: 'Cobertura Pinheiros com Vista',
      slug: 'cobertura-pinheiros-vista',
      description:
        'Cobertura espetacular com terraço privativo e vista panorâmica de São Paulo. Acabamento de luxo, espaço gourmet completo e localização premium em Pinheiros.',
      status: 'PRONTO' as const,
      purpose: 'VENDA' as const,
      price: 3800000,
      condoFee: 3500,
      iptuYearly: 28000,
      areaTotal: 250,
      areaPrivate: 200,
      bedrooms: 4,
      suites: 3,
      bathrooms: 4,
      parkingSpots: 3,
      floor: 15,
      yearBuilt: 2020,
      allowAirbnb: false,
      highlights: [
        'Terraço com piscina privativa',
        'Vista 360º',
        'Espaço gourmet completo',
        'Home theater',
        'Automação residencial',
      ],
      lat: -23.5645,
      lng: -46.6822,
      developer: 'Construtora Alto Padrão',
      featured: true,
      published: true,
      address: {
        street: 'Rua dos Pinheiros',
        streetNumber: '800',
        neighborhoodSlug: 'pinheiros',
        complement: null,
        postalCode: '05422-001',
        lat: -23.5645,
        lng: -46.6822,
        // Legacy fields
        district: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '05422-001',
        country: 'Brasil',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
          alt: 'Vista da cobertura',
          width: 1200,
          height: 800,
          position: 0,
        },
      ],
      amenityNames: [
        'Piscina',
        'Academia',
        'Salão de Festas',
        'Portaria 24h',
        'Elevador',
      ],
    },
    {
      title: 'Apartamento 2 Quartos Vila Mariana',
      slug: 'apartamento-2-quartos-vila-mariana',
      description:
        'Apartamento de 2 quartos em ótimo estado de conservação na Vila Mariana. Excelente localização com fácil acesso ao metrô e comércio local. Ideal para morar ou investir.',
      status: 'PRONTO' as const,
      purpose: 'ALUGUEL' as const,
      price: 3500,
      condoFee: 800,
      iptuYearly: 4500,
      areaTotal: 75,
      areaPrivate: 65,
      bedrooms: 2,
      suites: 0,
      bathrooms: 1,
      parkingSpots: 1,
      floor: 3,
      yearBuilt: 2015,
      allowAirbnb: true,
      highlights: [
        'Próximo ao metrô',
        'Varanda',
        'Armários planejados',
        'Permite Airbnb',
      ],
      lat: -23.5880,
      lng: -46.6385,
      featured: false,
      published: true,
      address: {
        street: 'Rua Tutóia',
        streetNumber: '1500',
        neighborhoodSlug: 'vila-mariana',
        complement: null,
        postalCode: '04007-001',
        lat: -23.5880,
        lng: -46.6385,
        // Legacy fields
        district: 'Vila Mariana',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '04007-001',
        country: 'Brasil',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200',
          alt: 'Sala',
          width: 1200,
          height: 800,
          position: 0,
        },
      ],
      amenityNames: ['Portaria 24h', 'Elevador', 'Garagem Coberta'],
    },
    {
      title: 'Lançamento Jardins - 3 Suítes',
      slug: 'lancamento-jardins-3-suites',
      description:
        'Lançamento exclusivo nos Jardins com 3 suítes e infraestrutura completa. Projeto assinado por renomado arquiteto. Alto padrão de acabamento e localização premium.',
      status: 'LANCAMENTO' as const,
      purpose: 'VENDA' as const,
      price: 2800000,
      condoFee: 2500,
      iptuYearly: 20000,
      areaTotal: 165,
      areaPrivate: 135,
      bedrooms: 3,
      suites: 3,
      bathrooms: 4,
      parkingSpots: 2,
      deliveryDate: new Date('2026-06-01'),
      allowAirbnb: false,
      highlights: [
        'Projeto arquitetônico exclusivo',
        'Terraço com churrasqueira',
        'Pé-direito alto',
        'Vaga dupla',
      ],
      lat: -23.5610,
      lng: -46.6690,
      developer: 'Construtora Premium',
      featured: true,
      published: true,
      address: {
        street: 'Alameda Santos',
        streetNumber: '2000',
        neighborhoodSlug: 'jardins',
        complement: null,
        postalCode: '01418-100',
        lat: -23.5610,
        lng: -46.6690,
        // Legacy fields
        district: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '01418-100',
        country: 'Brasil',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
          alt: 'Fachada moderna',
          width: 1200,
          height: 800,
          position: 0,
        },
      ],
      amenityNames: [
        'Piscina',
        'Academia',
        'Salão de Festas',
        'Churrasqueira',
        'Portaria 24h',
        'Elevador',
      ],
    },
    {
      title: 'Studio Pinheiros - Investimento',
      slug: 'studio-pinheiros-investimento',
      description:
        'Studio mobiliado em Pinheiros, perfeito para Airbnb ou aluguel tradicional. Localização estratégica próxima a restaurantes, bares e transporte público. Alto potencial de rentabilidade.',
      status: 'PRONTO' as const,
      purpose: 'VENDA' as const,
      price: 520000,
      condoFee: 650,
      iptuYearly: 4000,
      areaTotal: 32,
      areaPrivate: 28,
      bedrooms: 1,
      suites: 0,
      bathrooms: 1,
      parkingSpots: 0,
      floor: 4,
      yearBuilt: 2019,
      allowAirbnb: true,
      highlights: [
        'Mobiliado',
        'Ideal para Airbnb',
        'Localização premium',
        'Alta rentabilidade',
      ],
      lat: -23.5640,
      lng: -46.6815,
      featured: true,
      published: true,
      address: {
        street: 'Rua Teodoro Sampaio',
        streetNumber: '1200',
        neighborhoodSlug: 'pinheiros',
        complement: null,
        postalCode: '05405-000',
        lat: -23.5640,
        lng: -46.6815,
        // Legacy fields
        district: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '05405-000',
        country: 'Brasil',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200',
          alt: 'Studio compacto',
          width: 1200,
          height: 800,
          position: 0,
        },
      ],
      amenityNames: ['Portaria 24h', 'Elevador'],
    },
  ]

  // Se não houver bairros, pular criação de imóveis
  if (!sampleNeighborhood) {
    console.log('⏭️ Pulando criação de imóveis (nenhum bairro encontrado)')
  } else {
    console.log('🏠 Criando imóveis de exemplo...')
  }

  for (const propertyData of propertiesData) {
    // Se não houver bairros, pular
    if (!sampleNeighborhood) {
      continue
    }

    const { address: addressData, images: imagesData, amenityNames, ...propertyInfo } = propertyData

    // Extrair neighborhoodSlug se existir
    const { neighborhoodSlug, ...addressFields } = addressData as {
      neighborhoodSlug?: string
      street?: string
      streetNumber?: string
      number?: string
      complement?: string | null
      postalCode?: string
      zipcode?: string
      lat?: number
      lng?: number
      district?: string
      city?: string
      state?: string
      country?: string
    }

    // Buscar neighborhood pelo slug ou usar o sample
    let neighborhoodId: number
    if (neighborhoodSlug) {
      const neighborhood = await prisma.neighborhood.findUnique({
        where: { slug: neighborhoodSlug },
      })
      if (!neighborhood) {
        console.warn(`⚠️ Neighborhood com slug "${neighborhoodSlug}" não encontrado, usando bairro padrão`)
        neighborhoodId = sampleNeighborhood.id
      } else {
        neighborhoodId = neighborhood.id
      }
    } else {
      // Fallback: usar o bairro encontrado
      neighborhoodId = sampleNeighborhood.id
    }

    // Create address com a nova estrutura
    const address = await prisma.address.create({
      data: {
        ...addressFields,
        neighborhoodId,
        // Garantir que campos obrigatórios existam
        street: addressFields.street || addressFields.streetNumber || '',
        streetNumber: addressFields.streetNumber || addressFields.number || '',
        postalCode: addressFields.postalCode || addressFields.zipcode || '',
      },
    })

    // Create property
    const property = await prisma.property.create({
      data: {
        ...propertyInfo,
        addressId: address.id,
      },
    })

    // Create images
    if (imagesData) {
      await prisma.propertyImage.createMany({
        data: imagesData.map((img) => ({
          ...img,
          propertyId: property.id,
        })),
      })
    }

    // Connect amenities
    if (amenityNames) {
      for (const amenityName of amenityNames) {
        const amenity = amenities.find((a) => a.name === amenityName)
        if (amenity) {
          await prisma.propertyAmenity.create({
            data: {
              propertyId: property.id,
              amenityId: amenity.id,
            },
          })
        }
      }
    }

    console.log(`✅ Imóvel criado: ${property.title}`)
  }

  // Create sample leads
  const leadsData = [
    {
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 98765-4321',
      message: 'Gostaria de agendar uma visita.',
      source: 'site',
    },
    {
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 97654-3210',
      message: 'Tenho interesse neste imóvel. Qual o valor do condomínio?',
      source: 'site',
    },
  ]

  const properties = await prisma.property.findMany({ take: 2 })

  for (let i = 0; i < leadsData.length; i++) {
    await prisma.lead.create({
      data: {
        ...leadsData[i],
        propertyId: properties[i]?.id,
      },
    })
  }

  console.log(`✅ ${leadsData.length} leads criados`)

  console.log('🎉 Seed concluído com sucesso!')
  console.log(`\n📧 Login admin: ${adminEmail}`)
  console.log(`🔑 Senha: ${adminPassword}`)
  console.log(`\n🌐 Acesse: http://localhost:3000/admin`)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


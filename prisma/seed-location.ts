/**
 * Seed para popular tabelas de localização (State, City, Region, Neighborhood, Address)
 * 
 * ⚠️ IMPORTANTE: Execute este seed APÓS executar o SQL de criação de tabelas:
 * psql $DATABASE_URL -f prisma/sql/00_add_location_tables.sql
 * 
 * Execute com: pnpm tsx prisma/seed-location.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Type helper para acessar modelos que podem não estar no Prisma Client ainda
type PrismaWithLocation = PrismaClient & {
  state: any
  city: any
  region: any
  neighborhood: any
  address: any
}

const prismaLocation = prisma as PrismaWithLocation

// Tipos para os dados dos JSONs
interface EstadoData {
  id: number
  name: string
  code: string
}

interface CityData {
  id: number
  name: string
  state_id: number
}

interface RegionData {
  id: number
  name: string
  is_active: boolean
}

interface NeighborhoodData {
  id: number
  name: string
  city_id: number
  region_id: number | null
}

interface AddressData {
  id: number
  street: string
  street_number: string
  complement: string | null
  postal_code: string
  location: string | null
  neighborhood_id: number
}

async function main() {
  console.log('🌱 Iniciando seed de localização...\n')

  // ============================================================================
  // 1. ESTADOS
  // ============================================================================
  console.log('📍 1/5 Criando estados...')
  const estadosData: EstadoData[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/estados.json'), 'utf-8')
  )

  const stateIdMap = new Map<number, number>() // id antigo -> id novo (int)

  for (const estado of estadosData) {
    // Verificar se já existe com o ID do JSON
    let state = await prismaLocation.state.findUnique({
      where: { id: estado.id },
    })

    if (!state) {
      // Criar novo com o ID do JSON usando SQL raw (Prisma não permite id com autoincrement)
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "state" (id, name, code, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          estado.id,
          estado.name,
          estado.code
        )
        state = await prismaLocation.state.findUnique({
          where: { id: estado.id },
        })
        if (!state) {
          // Se não foi criado (conflito), buscar por code
          state = await prismaLocation.state.findUnique({
            where: { code: estado.code },
          })
        }
      } catch (error) {
        // Se falhar, tentar encontrar por code
        const existingByCode = await prismaLocation.state.findUnique({
          where: { code: estado.code },
        })
        if (existingByCode) {
          state = existingByCode
        } else {
          throw error
        }
      }
    } else {
      // Atualizar se necessário (mas manter o ID)
      if (state.name !== estado.name || state.code !== estado.code) {
        state = await prismaLocation.state.update({
          where: { id: estado.id },
          data: {
            name: estado.name,
            code: estado.code,
          },
        })
      }
    }
    stateIdMap.set(estado.id, state.id)
  }

  console.log(`✅ ${stateIdMap.size} estados criados\n`)

  // ============================================================================
  // 2. REGIÕES
  // ============================================================================
  console.log('🗺️ 2/5 Criando regiões...')
  const regionsData: RegionData[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/region.json'), 'utf-8')
  )

  const regionIdMap = new Map<number, number>() // id antigo -> id novo (int)

  for (const regionData of regionsData) {
    // Verificar se já existe com o ID do JSON
    let region = await prismaLocation.region.findUnique({
      where: { id: regionData.id },
    })

    if (!region) {
      // Criar nova com o ID do JSON usando SQL raw (Prisma não permite id com autoincrement)
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "region" (id, name, is_active, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          regionData.id,
          regionData.name,
          regionData.is_active
        )
        region = await prismaLocation.region.findUnique({
          where: { id: regionData.id },
        })
        if (!region) {
          // Se não foi criado (conflito), buscar por nome
          region = await prismaLocation.region.findFirst({
            where: { name: regionData.name },
          })
        }
      } catch (error) {
        // Se falhar, tentar encontrar por nome
        const existingByName = await prismaLocation.region.findFirst({
          where: { name: regionData.name },
        })
        if (existingByName) {
          region = existingByName
        } else {
          throw error
        }
      }
    } else {
      // Atualizar se necessário (mas manter o ID)
      if (region.name !== regionData.name || region.isActive !== regionData.is_active) {
        region = await prismaLocation.region.update({
          where: { id: regionData.id },
          data: {
            name: regionData.name,
            isActive: regionData.is_active,
          },
        })
      }
    }
    regionIdMap.set(regionData.id, region.id)
  }

  console.log(`✅ ${regionIdMap.size} regiões criadas\n`)

  // ============================================================================
  // 3. CIDADES
  // ============================================================================
  console.log('🏙️ 3/5 Criando cidades...')
  const citiesData: CityData[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/cities-cidades.json'), 'utf-8')
  )

  const cityIdMap = new Map<number, number>() // id antigo -> id novo (int)
  let citiesCreated = 0
  let citiesSkipped = 0

  for (const cityData of citiesData) {
    const stateId = stateIdMap.get(cityData.state_id)
    
    if (!stateId) {
      console.warn(`⚠️ Estado com id ${cityData.state_id} não encontrado para cidade ${cityData.name}`)
      citiesSkipped++
      continue
    }

    // Verificar se já existe com o ID do JSON
    let city = await prismaLocation.city.findUnique({
      where: { id: cityData.id },
    })

    if (!city) {
      // Criar nova com o ID do JSON usando SQL raw (Prisma não permite id com autoincrement)
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "city" (id, name, state_id, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          cityData.id,
          cityData.name,
          stateId
        )
        city = await prismaLocation.city.findUnique({
          where: { id: cityData.id },
        })
        if (!city) {
          // Se não foi criado (conflito), buscar por nome+stateId
          city = await prismaLocation.city.findFirst({
            where: {
              name: cityData.name,
              stateId: stateId,
            },
          })
        } else {
          citiesCreated++
        }
      } catch (error) {
        // Se falhar, tentar encontrar por nome+stateId
        const existingCity = await prismaLocation.city.findFirst({
          where: {
            name: cityData.name,
            stateId: stateId,
          },
        })
        if (existingCity) {
          city = existingCity
        } else {
          throw error
        }
      }
    } else {
      // Atualizar se necessário (mas manter o ID)
      if (city.name !== cityData.name || city.stateId !== stateId) {
        city = await prismaLocation.city.update({
          where: { id: cityData.id },
          data: {
            name: cityData.name,
            stateId: stateId,
          },
        })
      }
    }
    cityIdMap.set(cityData.id, city.id)
  }

  console.log(`✅ ${citiesCreated} cidades criadas, ${citiesSkipped} ignoradas (total mapeadas: ${cityIdMap.size})\n`)

  // ============================================================================
  // 4. BAIRROS
  // ============================================================================
  console.log('🏘️ 4/5 Criando bairros...')
  const neighborhoodsData: NeighborhoodData[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/bairros.json'), 'utf-8')
  )

  const neighborhoodIdMap = new Map<number, number>() // id antigo -> id novo (int)
  let neighborhoodsCreated = 0
  let neighborhoodsSkipped = 0

  for (const neighborhoodData of neighborhoodsData) {
    const cityId = cityIdMap.get(neighborhoodData.city_id)
    
    if (!cityId) {
      console.warn(`⚠️ Cidade com id ${neighborhoodData.city_id} não encontrada para bairro ${neighborhoodData.name}`)
      neighborhoodsSkipped++
      continue
    }

    const regionId = neighborhoodData.region_id 
      ? regionIdMap.get(neighborhoodData.region_id) 
      : null

    // Gerar slug a partir do nome
    const slug = neighborhoodData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui espaços e caracteres especiais por hífen
      .replace(/^-+|-+$/g, '') // Remove hífens no início e fim

    // Verificar se já existe com o ID do JSON
    let neighborhood = await prismaLocation.neighborhood.findUnique({
      where: { id: neighborhoodData.id },
    })

    if (!neighborhood) {
      // Criar novo com o ID do JSON usando SQL raw (Prisma não permite id com autoincrement)
      try {
        // Usar SQL raw para inserir com ID específico
        if (regionId) {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "neighborhood" (id, slug, name, city_id, region_id, published, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
             ON CONFLICT (id) DO NOTHING`,
            neighborhoodData.id,
            slug,
            neighborhoodData.name,
            cityId,
            regionId,
            true
          )
        } else {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "neighborhood" (id, slug, name, city_id, region_id, published, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, NULL, $5, NOW(), NOW())
             ON CONFLICT (id) DO NOTHING`,
            neighborhoodData.id,
            slug,
            neighborhoodData.name,
            cityId,
            true
          )
        }
        
        // Buscar o registro criado
        neighborhood = await prismaLocation.neighborhood.findUnique({
          where: { id: neighborhoodData.id },
        })
        
        if (neighborhood) {
          neighborhoodsCreated++
        } else {
          // Se não foi criado (conflito), buscar por slug
          neighborhood = await prismaLocation.neighborhood.findUnique({
            where: { slug },
          })
        }
      } catch (error) {
        // Se falhar, tentar encontrar por slug
        const existingBySlug = await prismaLocation.neighborhood.findUnique({
          where: { slug },
        })
        if (existingBySlug) {
          neighborhood = existingBySlug
        } else {
          throw error
        }
      }
    } else {
      // Atualizar se necessário (mas manter o ID)
      const needsUpdate = 
        neighborhood.name !== neighborhoodData.name ||
        neighborhood.cityId !== cityId ||
        neighborhood.regionId !== regionId

      if (needsUpdate) {
        neighborhood = await prismaLocation.neighborhood.update({
          where: { id: neighborhoodData.id },
          data: {
            name: neighborhoodData.name,
            cityId: cityId,
            regionId: regionId || null,
          },
        })
      }
    }
    neighborhoodIdMap.set(neighborhoodData.id, neighborhood.id)
  }

  console.log(`✅ ${neighborhoodsCreated} bairros criados, ${neighborhoodsSkipped} ignorados (total mapeados: ${neighborhoodIdMap.size})\n`)

  // ============================================================================
  // 5. ENDEREÇOS
  // ============================================================================
  console.log('📍 5/5 Criando endereços...')
  const addressesData: AddressData[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/address.json'), 'utf-8')
  )

  let addressesCreated = 0
  let addressesSkipped = 0
  const batchSize = 100
  let batch: Array<{ addressData: AddressData; neighborhoodId: number }> = []

  for (const addressData of addressesData) {
    const neighborhoodId = neighborhoodIdMap.get(addressData.neighborhood_id)
    
    if (!neighborhoodId) {
      addressesSkipped++
      continue
    }

    batch.push({ addressData, neighborhoodId })

    // Processar em lotes para melhor performance
    if (batch.length >= batchSize) {
      try {
        await Promise.all(
          batch.map(async ({ addressData, neighborhoodId }) => {
            // Verificar se já existe com o ID do JSON
            const existing = await prismaLocation.address.findUnique({
              where: { id: addressData.id },
            })

            if (existing) {
              return // Já existe, pular
            }

            // Converter location (PostGIS WKB) para lat/lng se necessário
            const lat: number | null = null
            const lng: number | null = null
            
            if (addressData.location) {
              // Se location é uma string WKB, precisamos converter
              // Por enquanto, vamos deixar null e preencher depois se necessário
              // Ou você pode usar uma biblioteca como wkx para converter
            }

            // Usar SQL raw para inserir com ID específico (Prisma não permite id com autoincrement)
            await prisma.$executeRawUnsafe(
              `INSERT INTO "address" (id, street, street_number, complement, postal_code, neighborhood_id, lat, lng, district, city, state, zipcode, country, "createdAt", "updatedAt")
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL, NULL, NULL, $9, $10, NOW(), NOW())
               ON CONFLICT (id) DO NOTHING`,
              addressData.id,
              addressData.street || '',
              addressData.street_number || '',
              addressData.complement || null,
              addressData.postal_code || '',
              neighborhoodId,
              lat,
              lng,
              addressData.postal_code || null,
              'Brasil'
            )
            addressesCreated++
          })
        )
        process.stdout.write(`\r   Processados ${addressesCreated} endereços...`)
      } catch (error: unknown) {
        // Se houver erro de duplicata ou outro, continuar
        const message = error instanceof Error ? error.message : String(error)
        console.warn(`\n⚠️ Erro ao criar lote: ${message}`)
      }
      batch = []
    }
  }

  // Processar último lote
  if (batch.length > 0) {
    try {
      await Promise.all(
        batch.map(async ({ addressData, neighborhoodId }) => {
          // Verificar se já existe com o ID do JSON
          const existing = await prismaLocation.address.findUnique({
            where: { id: addressData.id },
          })

          if (existing) {
            return // Já existe, pular
          }

          // Converter location (PostGIS WKB) para lat/lng se necessário
          const lat: number | null = null
          const lng: number | null = null
          
          if (addressData.location) {
            // Se location é uma string WKB, precisamos converter
            // Por enquanto, vamos deixar null e preencher depois se necessário
          }

          // Usar SQL raw para inserir com ID específico (Prisma não permite id com autoincrement)
          await prisma.$executeRawUnsafe(
            `INSERT INTO "address" (id, street, street_number, complement, postal_code, neighborhood_id, lat, lng, district, city, state, zipcode, country, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL, NULL, NULL, $9, $10, NOW(), NOW())
             ON CONFLICT (id) DO NOTHING`,
            addressData.id,
            addressData.street || '',
            addressData.street_number || '',
            addressData.complement || null,
            addressData.postal_code || '',
            neighborhoodId,
            lat,
            lng,
            addressData.postal_code || null,
            'Brasil'
          )
          addressesCreated++
        })
      )
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`\n⚠️ Erro ao criar último lote: ${message}`)
    }
  }

  console.log(`\n✅ ${addressesCreated} endereços criados, ${addressesSkipped} ignorados\n`)

  // ============================================================================
  // RESUMO
  // ============================================================================
  console.log('📊 RESUMO:')
  console.log(`   Estados: ${stateIdMap.size}`)
  console.log(`   Regiões: ${regionIdMap.size}`)
  console.log(`   Cidades: ${cityIdMap.size}`)
  console.log(`   Bairros: ${neighborhoodIdMap.size}`)
  console.log(`   Endereços: ${addressesCreated}`)
  console.log('\n✅ Seed de localização concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


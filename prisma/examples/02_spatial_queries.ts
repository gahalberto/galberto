/**
 * ============================================================================
 * EXEMPLOS DE QUERIES GEOESPACIAIS
 * ============================================================================
 * Exemplos de buscas por proximidade usando PostGIS (OPÇÃO A) ou Haversine (OPÇÃO B)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// OPÇÃO A: QUERIES COM POSTGIS (geography)
// ============================================================================
// Use estas queries se escolheu PostGIS no schema

/**
 * Buscar imóveis em um raio específico usando PostGIS
 * @param lat Latitude do ponto central
 * @param lng Longitude do ponto central
 * @param radiusMeters Raio em metros (ex: 1000 = 1km)
 */
export async function buscarImoveisProximosPostGIS(
  lat: number,
  lng: number,
  radiusMeters: number = 1000
) {
  // Query usando ST_DWithin para busca eficiente com índice GIST
  const result = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      slug: string;
      price: number | null;
      street: string;
      neighborhood_name: string;
      city_name: string;
      state_code: string;
      distance_meters: number;
    }>
  >`
    SELECT 
      p.id,
      p.title,
      p.slug,
      p.price,
      a.street,
      n.name as neighborhood_name,
      c.name as city_name,
      s.code as state_code,
      ST_Distance(
        a.location,
        ST_GeogFromText(${`SRID=4326;POINT(${lng} ${lat})`})
      ) as distance_meters
    FROM "Property" p
    INNER JOIN "address" a ON p."addressId" = a.id
    INNER JOIN "neighborhood" n ON a."neighborhood_id" = n.id
    INNER JOIN "city" c ON n."city_id" = c.id
    INNER JOIN "state" s ON c."state_id" = s.id
    WHERE 
      p.published = true
      AND a.location IS NOT NULL
      AND ST_DWithin(
        a.location,
        ST_GeogFromText(${`SRID=4326;POINT(${lng} ${lat})`}),
        ${radiusMeters}
      )
    ORDER BY distance_meters ASC
    LIMIT 50
  `;

  console.log(`📍 PostGIS: ${result.length} imóveis em ${radiusMeters}m de raio`);
  result.forEach((item, idx) => {
    console.log(
      `${idx + 1}. ${item.title} - ${item.neighborhood_name} (${Math.round(item.distance_meters)}m)`
    );
  });

  return result;
}

/**
 * Buscar imóveis dentro de um polígono (bounding box) usando PostGIS
 */
export async function buscarImoveisDentroDePoligonoPostGIS(coordinates: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}) {
  const { minLat, maxLat, minLng, maxLng } = coordinates;

  // Criar polígono WKT (Well-Known Text)
  const polygon = `POLYGON((
    ${minLng} ${minLat},
    ${maxLng} ${minLat},
    ${maxLng} ${maxLat},
    ${minLng} ${maxLat},
    ${minLng} ${minLat}
  ))`;

  const result = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      slug: string;
      price: number | null;
      street: string;
      neighborhood_name: string;
    }>
  >`
    SELECT 
      p.id,
      p.title,
      p.slug,
      p.price,
      a.street,
      n.name as neighborhood_name
    FROM "Property" p
    INNER JOIN "address" a ON p."addressId" = a.id
    INNER JOIN "neighborhood" n ON a."neighborhood_id" = n.id
    WHERE 
      p.published = true
      AND a.location IS NOT NULL
      AND ST_Within(
        a.location::geometry,
        ST_GeomFromText(${`SRID=4326;${polygon}`})
      )
    ORDER BY p."createdAt" DESC
    LIMIT 50
  `;

  console.log(`📍 PostGIS: ${result.length} imóveis dentro do polígono`);
  return result;
}

/**
 * Calcular distância entre dois pontos usando PostGIS
 */
export async function calcularDistanciaPostGIS(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
) {
  const result = await prisma.$queryRaw<Array<{ distance_meters: number }>>`
    SELECT 
      ST_Distance(
        ST_GeogFromText(${`SRID=4326;POINT(${point1.lng} ${point1.lat})`}),
        ST_GeogFromText(${`SRID=4326;POINT(${point2.lng} ${point2.lat})`})
      ) as distance_meters
  `;

  const distanceKm = result[0].distance_meters / 1000;
  console.log(`📏 Distância: ${distanceKm.toFixed(2)} km`);

  return result[0].distance_meters;
}

// ============================================================================
// OPÇÃO B: QUERIES COM HAVERSINE (lat/lng sem PostGIS)
// ============================================================================
// Use estas queries se NÃO tem PostGIS (usa campos lat/lng simples)

/**
 * Fórmula de Haversine para calcular distância entre dois pontos
 * Retorna distância em metros
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distância em metros
}

/**
 * Buscar imóveis próximos usando Haversine (SQL)
 * Usa bounding box para pré-filtro (mais eficiente)
 */
export async function buscarImoveisProximosHaversine(
  lat: number,
  lng: number,
  radiusMeters: number = 1000
) {
  // Calcular bounding box aproximado (1 grau ≈ 111km)
  const radiusKm = radiusMeters / 1000;
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const result = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      slug: string;
      price: number | null;
      street: string;
      neighborhood_name: string;
      city_name: string;
      state_code: string;
      lat: number;
      lng: number;
      distance_meters: number;
    }>
  >`
    SELECT 
      p.id,
      p.title,
      p.slug,
      p.price,
      a.street,
      n.name as neighborhood_name,
      c.name as city_name,
      s.code as state_code,
      a.lat,
      a.lng,
      (
        6371000 * acos(
          cos(radians(${lat})) * 
          cos(radians(a.lat)) * 
          cos(radians(a.lng) - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians(a.lat))
        )
      ) as distance_meters
    FROM "Property" p
    INNER JOIN "address" a ON p."addressId" = a.id
    INNER JOIN "neighborhood" n ON a."neighborhood_id" = n.id
    INNER JOIN "city" c ON n."city_id" = c.id
    INNER JOIN "state" s ON c."state_id" = s.id
    WHERE 
      p.published = true
      AND a.lat IS NOT NULL 
      AND a.lng IS NOT NULL
      -- Bounding box pré-filtro (usa índice)
      AND a.lat BETWEEN ${lat - latDelta} AND ${lat + latDelta}
      AND a.lng BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
    HAVING (
      6371000 * acos(
        cos(radians(${lat})) * 
        cos(radians(a.lat)) * 
        cos(radians(a.lng) - radians(${lng})) + 
        sin(radians(${lat})) * 
        sin(radians(a.lat))
      )
    ) < ${radiusMeters}
    ORDER BY distance_meters ASC
    LIMIT 50
  `;

  console.log(`📍 Haversine: ${result.length} imóveis em ${radiusMeters}m de raio`);
  result.forEach((item, idx) => {
    console.log(
      `${idx + 1}. ${item.title} - ${item.neighborhood_name} (${Math.round(item.distance_meters)}m)`
    );
  });

  return result;
}

/**
 * Buscar imóveis próximos usando Haversine (TypeScript puro)
 * Mais lento que SQL, mas funciona sem banco de dados
 */
export async function buscarImoveisProximosHaversineTS(
  lat: number,
  lng: number,
  radiusMeters: number = 1000
) {
  // Buscar imóveis com coordenadas (pré-filtro com bounding box)
  const radiusKm = radiusMeters / 1000;
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const properties = await prisma.property.findMany({
    where: {
      published: true,
      address: {
        lat: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        lng: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      },
    },
    include: {
      address: {
        include: {
          neighborhood: {
            include: {
              city: {
                include: {
                  state: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Calcular distância e filtrar
  const results = properties
    .map((property) => {
      const addr = property.address;
      if (!addr || addr.lat === null || addr.lng === null) return null;

      const distance = haversineDistance(lat, lng, addr.lat, addr.lng);

      return {
        ...property,
        distance_meters: distance,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.distance_meters <= radiusMeters)
    .sort((a, b) => a.distance_meters - b.distance_meters)
    .slice(0, 50);

  console.log(`📍 Haversine TS: ${results.length} imóveis em ${radiusMeters}m de raio`);

  return results;
}

/**
 * Buscar bairros mais próximos de um ponto
 */
export async function buscarBairrosProximos(
  lat: number,
  lng: number,
  limit: number = 10
) {
  const radiusKm = 10; // 10km de raio para busca
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const result = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      slug: string;
      city_name: string;
      state_code: string;
      lat: number;
      lng: number;
      distance_meters: number;
      total_imoveis: number;
    }>
  >`
    SELECT 
      n.id,
      n.name,
      n.slug,
      c.name as city_name,
      s.code as state_code,
      n.lat,
      n.lng,
      (
        6371000 * acos(
          cos(radians(${lat})) * 
          cos(radians(n.lat)) * 
          cos(radians(n.lng) - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians(n.lat))
        )
      ) as distance_meters,
      (
        SELECT COUNT(*)
        FROM "address" a
        INNER JOIN "Property" p ON a.id = p."addressId"
        WHERE a."neighborhood_id" = n.id AND p.published = true
      ) as total_imoveis
    FROM "neighborhood" n
    INNER JOIN "city" c ON n."city_id" = c.id
    INNER JOIN "state" s ON c."state_id" = s.id
    WHERE 
      n.published = true
      AND n.lat IS NOT NULL 
      AND n.lng IS NOT NULL
      AND n.lat BETWEEN ${lat - latDelta} AND ${lat + latDelta}
      AND n.lng BETWEEN ${lng - lngDelta} AND ${lng + lngDelta}
    ORDER BY distance_meters ASC
    LIMIT ${limit}
  `;

  console.log(`📍 ${result.length} bairros próximos:`);
  result.forEach((bairro, idx) => {
    console.log(
      `${idx + 1}. ${bairro.name} (${bairro.city_name}) - ${(bairro.distance_meters / 1000).toFixed(2)}km - ${bairro.total_imoveis} imóveis`
    );
  });

  return result;
}

// ============================================================================
// EXEMPLO DE USO
// ============================================================================

async function main() {
  try {
    // Coordenadas de exemplo (Av. Paulista, São Paulo)
    const lat = -23.5505;
    const lng = -46.6333;

    console.log('\n=== OPÇÃO A: PostGIS ===');
    // Descomente se tiver PostGIS instalado:
    // await buscarImoveisProximosPostGIS(lat, lng, 1000);
    // await calcularDistanciaPostGIS(
    //   { lat: -23.5505, lng: -46.6333 },
    //   { lat: -23.5629, lng: -46.6544 }
    // );

    console.log('\n=== OPÇÃO B: Haversine (SQL) ===');
    await buscarImoveisProximosHaversine(lat, lng, 1000);

    console.log('\n=== OPÇÃO B: Haversine (TypeScript) ===');
    await buscarImoveisProximosHaversineTS(lat, lng, 1000);

    console.log('\n=== Bairros Próximos ===');
    await buscarBairrosProximos(lat, lng, 5);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Descomente para executar:
// main();


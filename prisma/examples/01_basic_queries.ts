/**
 * ============================================================================
 * EXEMPLOS DE QUERIES - Estrutura Hierárquica de Localização
 * ============================================================================
 * Exemplos práticos de como usar os novos modelos State, City, Region,
 * Neighborhood e Address com Prisma Client
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// 1. LISTAR ESTADOS COM SUAS CIDADES
// ============================================================================

export async function listarEstadosComCidades() {
  const estados = await prisma.state.findMany({
    include: {
      cities: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { code: 'asc' },
  });

  console.log('📍 Estados e Cidades:');
  estados.forEach((estado) => {
    console.log(`${estado.code} - ${estado.name} (${estado.cities.length} cidades)`);
  });

  return estados;
}

// ============================================================================
// 2. LISTAR BAIRROS DE UMA CIDADE ESPECÍFICA
// ============================================================================

export async function listarBairrosPorCidade(nomeCidade: string) {
  const bairros = await prisma.neighborhood.findMany({
    where: {
      city: {
        name: {
          contains: nomeCidade,
          mode: 'insensitive',
        },
      },
      published: true,
    },
    include: {
      city: {
        include: {
          state: true,
        },
      },
      region: true,
      _count: {
        select: {
          addresses: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  console.log(`📍 Bairros em ${nomeCidade}:`);
  bairros.forEach((bairro) => {
    console.log(
      `${bairro.name} (${bairro.city.name}/${bairro.city.state.code}) - ${bairro._count.addresses} endereços`
    );
  });

  return bairros;
}

// ============================================================================
// 3. BUSCAR IMÓVEL COM ENDEREÇO COMPLETO (hierarquia completa)
// ============================================================================

export async function buscarImovelComEnderecoCompleto(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
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
              region: true,
            },
          },
        },
      },
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
  });

  if (property && property.address) {
    const addr = property.address;
    const neighborhood = addr.neighborhood;
    const city = neighborhood.city;
    const state = city.state;

    console.log(`📍 Endereço completo do imóvel "${property.title}":`);
    console.log(`Rua: ${addr.street}, ${addr.streetNumber}`);
    console.log(`Bairro: ${neighborhood.name}`);
    console.log(`Cidade: ${city.name}/${state.code}`);
    console.log(`CEP: ${addr.postalCode}`);
    if (addr.lat && addr.lng) {
      console.log(`Coordenadas: ${addr.lat}, ${addr.lng}`);
    }
  }

  return property;
}

// ============================================================================
// 4. LISTAR IMÓVEIS DE UM BAIRRO ESPECÍFICO (com paginação)
// ============================================================================

export async function listarImoveisPorBairro(
  neighborhoodSlug: string,
  page: number = 1,
  pageSize: number = 10
) {
  const skip = (page - 1) * pageSize;

  const [imoveis, total] = await Promise.all([
    prisma.property.findMany({
      where: {
        published: true,
        address: {
          neighborhood: {
            slug: neighborhoodSlug,
          },
        },
      },
      include: {
        address: {
          include: {
            neighborhood: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.property.count({
      where: {
        published: true,
        address: {
          neighborhood: {
            slug: neighborhoodSlug,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  console.log(`📍 Imóveis no bairro (${neighborhoodSlug}):`);
  console.log(`Total: ${total} imóveis | Página ${page}/${totalPages}`);
  imoveis.forEach((imovel) => {
    console.log(`- ${imovel.title} | R$ ${imovel.price}`);
  });

  return {
    data: imoveis,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}

// ============================================================================
// 5. BUSCAR IMÓVEIS POR CIDADE OU ESTADO
// ============================================================================

export async function buscarImoveisPorLocalizacao(params: {
  stateCode?: string;
  cityName?: string;
  purpose?: 'VENDA' | 'ALUGUEL';
  minPrice?: number;
  maxPrice?: number;
}) {
  const { stateCode, cityName, purpose, minPrice, maxPrice } = params;

  const imoveis = await prisma.property.findMany({
    where: {
      published: true,
      ...(purpose && { purpose }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
      address: {
        neighborhood: {
          city: {
            ...(cityName && {
              name: {
                contains: cityName,
                mode: 'insensitive',
              },
            }),
            ...(stateCode && {
              state: {
                code: stateCode,
              },
            }),
          },
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
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
    orderBy: { price: 'asc' },
    take: 20,
  });

  console.log(`📍 Encontrados ${imoveis.length} imóveis`);
  return imoveis;
}

// ============================================================================
// 6. CRIAR IMÓVEL COM ENDEREÇO COMPLETO
// ============================================================================

export async function criarImovelComEndereco(data: {
  // Dados do imóvel
  title: string;
  description: string;
  slug: string;
  status: 'LANCAMENTO' | 'EM_OBRAS' | 'PRONTO';
  purpose: 'VENDA' | 'ALUGUEL';
  price?: number;
  // Dados do endereço
  street: string;
  streetNumber: string;
  complement?: string;
  postalCode: string;
  neighborhoodId: string; // ID do bairro existente
  lat?: number;
  lng?: number;
}) {
  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
      status: data.status,
      purpose: data.purpose,
      price: data.price,
      published: false,
      // Cria o endereço junto
      address: {
        create: {
          street: data.street,
          streetNumber: data.streetNumber,
          complement: data.complement,
          postalCode: data.postalCode,
          neighborhoodId: parseInt(data.neighborhoodId, 10),
          lat: data.lat,
          lng: data.lng,
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

  console.log(`✅ Imóvel criado: ${property.title}`);
  return property;
}

// ============================================================================
// 7. ATUALIZAR ENDEREÇO DE UM IMÓVEL
// ============================================================================

export async function atualizarEnderecoImovel(
  propertyId: string,
  novoEndereco: {
    street?: string;
    streetNumber?: string;
    complement?: string;
    postalCode?: string;
    neighborhoodId?: string;
    lat?: number;
    lng?: number;
  }
) {
  // Buscar o property para pegar o addressId
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { addressId: true },
  });

  if (!property) {
    throw new Error('Imóvel não encontrado');
  }

  // Atualizar o endereço
  const updatedAddress = await prisma.address.update({
    where: { id: property.addressId! },
    data: {
      ...novoEndereco,
      neighborhoodId: novoEndereco.neighborhoodId ? parseInt(novoEndereco.neighborhoodId, 10) : undefined,
      lat: novoEndereco.lat ?? undefined,
      lng: novoEndereco.lng ?? undefined,
    },
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
  });

  console.log(`✅ Endereço atualizado`);
  return updatedAddress;
}

// ============================================================================
// 8. ESTATÍSTICAS POR BAIRRO
// ============================================================================

export async function estatisticasPorBairro(neighborhoodSlug: string) {
  const stats = await prisma.property.aggregate({
    where: {
      published: true,
      address: {
        neighborhood: {
          slug: neighborhoodSlug,
        },
      },
    },
    _count: true,
    _avg: {
      price: true,
      areaTotal: true,
      bedrooms: true,
    },
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
  });

  console.log(`📊 Estatísticas do bairro ${neighborhoodSlug}:`);
  console.log(`Total de imóveis: ${stats._count}`);
  console.log(`Preço médio: R$ ${stats._avg.price?.toFixed(2)}`);
  console.log(`Área média: ${stats._avg.areaTotal?.toFixed(2)} m²`);
  console.log(`Preço mínimo: R$ ${stats._min.price}`);
  console.log(`Preço máximo: R$ ${stats._max.price}`);

  return stats;
}

// ============================================================================
// 9. BUSCAR BAIRROS PRÓXIMOS (baseado em lat/lng do bairro)
// ============================================================================

export async function buscarBairrosProximos(
  neighborhoodSlug: string,
  raioKm: number = 5
) {
  // Buscar bairro de origem
  const origin = await prisma.neighborhood.findUnique({
    where: { slug: neighborhoodSlug },
    select: { lat: true, lng: true, name: true },
  });

  if (!origin || !origin.lat || !origin.lng) {
    throw new Error('Bairro não encontrado ou sem coordenadas');
  }

  // Calcular bounding box aproximado (1 grau ≈ 111km)
  const latDelta = raioKm / 111;
  const lngDelta = raioKm / (111 * Math.cos((origin.lat * Math.PI) / 180));

  const bairrosProximos = await prisma.neighborhood.findMany({
    where: {
      slug: { not: neighborhoodSlug },
      lat: {
        gte: origin.lat - latDelta,
        lte: origin.lat + latDelta,
      },
      lng: {
        gte: origin.lng - lngDelta,
        lte: origin.lng + lngDelta,
      },
      published: true,
    },
    include: {
      city: {
        include: {
          state: true,
        },
      },
      _count: {
        select: {
          addresses: true,
        },
      },
    },
  });

  console.log(`📍 Bairros próximos a ${origin.name} (${raioKm}km):`);
  bairrosProximos.forEach((bairro) => {
    console.log(`- ${bairro.name} (${bairro.city.name})`);
  });

  return bairrosProximos;
}

// ============================================================================
// EXEMPLO DE USO
// ============================================================================

async function main() {
  try {
    // Exemplos de uso
    await listarEstadosComCidades();
    await listarBairrosPorCidade('São Paulo');
    await buscarImoveisPorLocalizacao({ stateCode: 'SP', purpose: 'VENDA' });
    await listarImoveisPorBairro('jardim-paulista', 1, 10);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Descomente para executar:
// main();


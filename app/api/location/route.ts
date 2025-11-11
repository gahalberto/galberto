import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const stateId = searchParams.get('stateId')
  const cityId = searchParams.get('cityId')

  try {
    if (type === 'states') {
      const states = await (db as any).state.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          code: true,
        },
      })
      return NextResponse.json(states)
    }

    if (type === 'cities' && stateId) {
      const stateIdNum = parseInt(stateId, 10)
      if (isNaN(stateIdNum)) {
        return NextResponse.json({ error: 'Invalid stateId' }, { status: 400 })
      }
      const cities = await (db as any).city.findMany({
        where: {
          stateId: stateIdNum,
        },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
        },
      })
      return NextResponse.json(cities)
    }

    if (type === 'neighborhoods' && cityId) {
      const cityIdNum = parseInt(cityId, 10)
      if (isNaN(cityIdNum)) {
        return NextResponse.json({ error: 'Invalid cityId' }, { status: 400 })
      }
      const neighborhoods = await (db as any).neighborhood.findMany({
        where: {
          cityId: cityIdNum,
          published: true,
        },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      })
      return NextResponse.json(neighborhoods)
    }

    if (type === 'regions') {
      const regions = await (db as any).region.findMany({
        where: {
          isActive: true,
        },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
        },
      })
      return NextResponse.json(regions)
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching location data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    )
  }
}


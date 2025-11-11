import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Simple auth check (in production, use proper authentication)
    const authHeader = request.headers.get('authorization')
    const secret = process.env.REVALIDATE_SECRET || 'your-secret-token'

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { path, tag } = body

    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        value: path,
        now: Date.now(),
      })
    }

    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        value: tag,
        now: Date.now(),
      })
    }

    return NextResponse.json(
      { error: 'Missing path or tag parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Revalidate error:', error)
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    )
  }
}


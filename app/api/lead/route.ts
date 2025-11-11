import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone inválido').optional(),
  message: z.string().optional(),
  propertyId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = leadSchema.parse(body)

    // Get UTM parameters from headers or URL
    const referer = request.headers.get('referer')
    const utmData = referer ? extractUtmParams(referer) : null

    // Create lead
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message || null,
        propertyId: data.propertyId || null,
        source: 'site',
        utm: utmData || undefined,
      },
    })

    // TODO: Send email notification using Resend
    // await sendEmailNotification(lead)

    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

function extractUtmParams(url: string): Record<string, string> | null {
  try {
    const urlObj = new URL(url)
    const utmParams: Record<string, string> = {}
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ]

    utmKeys.forEach((key) => {
      const value = urlObj.searchParams.get(key)
      if (value) utmParams[key] = value
    })

    return Object.keys(utmParams).length > 0 ? utmParams : null
  } catch {
    return null
  }
}

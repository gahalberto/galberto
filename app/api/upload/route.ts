import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

type UploadType = 'posts' | 'properties'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as UploadType) || 'posts'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP' },
        { status: 400 }
      )
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB' },
        { status: 400 }
      )
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'public', type)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Gerar nome único
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${randomUUID()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Ler buffer do arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Otimizar imagem com Sharp
    let optimizedBuffer: Buffer
    const metadata = await sharp(buffer).metadata()

    // Redimensionar se necessário (máximo 2000px na maior dimensão)
    const maxDimension = 2000
    let width = metadata.width
    let height = metadata.height

    if (width && height) {
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }
    }

    // Otimizar baseado no tipo
    if (file.type === 'image/png') {
      optimizedBuffer = await sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({ quality: 85, compressionLevel: 9 })
        .toBuffer()
    } else if (file.type === 'image/webp') {
      optimizedBuffer = await sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer()
    } else {
      // JPEG
      optimizedBuffer = await sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer()
    }

    // Salvar arquivo otimizado
    await writeFile(filePath, optimizedBuffer)

    // Retornar URL da imagem
    const imageUrl = `/${type}/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName,
      size: optimizedBuffer.length,
      originalSize: file.size,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    )
  }
}


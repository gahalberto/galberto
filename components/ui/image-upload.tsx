'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  type?: 'posts' | 'properties'
  label?: string
  className?: string
  maxSize?: number // em MB
}

export function ImageUpload({
  value,
  onChange,
  type = 'posts',
  label = 'Upload de Imagem',
  className,
  maxSize = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Atualizar preview quando value mudar
  useEffect(() => {
    if (value) {
      setPreview(value)
    } else {
      setPreview(null)
    }
  }, [value])

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo ${maxSize}MB`)
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Criar preview local
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Fazer upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      onChange(data.url)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload')
      setPreview(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleRemove() {
    setPreview(null)
    onChange('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleClick() {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Trocar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
          {value && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {value}
            </p>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            uploading
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5',
            error && 'border-destructive'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Fazendo upload e otimizando...
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Clique para fazer upload
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou WebP (máx. {maxSize}MB)
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {value && !preview && (
        <div className="text-xs text-muted-foreground">
          URL atual: {value}
        </div>
      )}
    </div>
  )
}


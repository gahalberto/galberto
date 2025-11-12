'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Briefcase } from 'lucide-react'

export function GabrielProfileImage() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
      {!imageError ? (
        <Image
          src="/images/gabriel-alberto.jpg"
          alt="Gabriel Alberto, consultor imobiliário CRECI 267769, em retrato profissional com terno azul em ambiente urbano moderno de São Paulo"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <Briefcase className="h-16 w-16 text-primary/30 mb-4" />
          <p className="text-sm text-muted-foreground">
            Foto profissional em breve
          </p>
          <p className="text-xs text-muted-foreground mt-2 px-4">
            Adicione a imagem em: public/images/gabriel-alberto.jpg
          </p>
        </div>
      )}
    </div>
  )
}




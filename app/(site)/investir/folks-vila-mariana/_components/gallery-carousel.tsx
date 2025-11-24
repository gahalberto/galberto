'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface GalleryCarouselProps {
  images: string[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const openModal = (index: number) => {
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  const getImageAlt = (img: string, idx: number) => {
    return `Folks Vila Mariana - ${img.split('/').pop()?.replace('.webp', '').replace(/-/g, ' ') || `Imagem ${idx + 1}`}`
  }

  return (
    <>
      {/* Carrossel Compacto */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${selectedIndex * 100}%)` }}>
            {images.map((img, idx) => (
              <div key={idx} className="min-w-full relative aspect-[16/9]">
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => openModal(idx)}
                >
                  <Image
                    src={img}
                    alt={getImageAlt(img, idx)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium">Clique para ampliar</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegação do Carrossel */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background shadow-lg"
              onClick={handlePrevious}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background shadow-lg"
              onClick={handleNext}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === selectedIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir para imagem ${idx + 1}`}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-md text-sm z-10">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Modal para Visualização Ampliada */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative h-full flex items-center justify-center">
            <Image
              src={images[selectedIndex]}
              alt={getImageAlt(images[selectedIndex], selectedIndex)}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {/* Navegação no Modal */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background"
                  onClick={handlePrevious}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background"
                  onClick={handleNext}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Contador no Modal */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-4 py-2 rounded-md text-sm z-20">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


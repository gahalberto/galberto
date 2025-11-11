'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  images: Array<{
    url: string
    alt: string | null
  }>
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    )
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden group">
          <Image
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt || title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-md text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all',
                  selectedIndex === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-primary/50'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${title} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] p-0">
          <div className="relative h-full">
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt || title}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


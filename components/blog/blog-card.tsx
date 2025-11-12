import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

interface BlogCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    coverImage?: string | null
    category: string
    publishedAt: Date | null
    readingTime?: number | null
    author: string
  }
}

const categoryLabels: Record<string, string> = {
  INVESTIMENTOS: 'Investimentos',
  MERCADO_IMOBILIARIO: 'Mercado Imobiliário',
  FINANCIAMENTOS: 'Financiamentos',
  DICAS_COMPRADORES: 'Dicas para Compradores',
  VALORIZACAO_BAIRROS: 'Valorização por Bairro',
  TENDENCIAS: 'Tendências',
  GUIA_COMPRADOR: 'Guia do Comprador',
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : post.coverImage
    : '/images/imagem-social.png'

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          {post.coverImage ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl text-primary/30">📝</span>
            </div>
          )}
        </div>
        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[post.category] || post.category}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardHeader>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-4">
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(new Date(post.publishedAt))}</span>
              </div>
            )}
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readingTime} min</span>
              </div>
            )}
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </CardFooter>
      </Link>
    </Card>
  )
}


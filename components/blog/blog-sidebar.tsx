import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, BookOpen } from 'lucide-react'
function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

interface BlogSidebarProps {
  categories: Array<{ category: string; count: number }>
  popularPosts: Array<{
    slug: string
    title: string
    publishedAt: Date | null
    views: number
  }>
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

export function BlogSidebar({ categories, popularPosts }: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categorias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.category}
                href={`/blog?categoria=${cat.category}`}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {categoryLabels[cat.category] || cat.category} ({cat.count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Populares */}
      {popularPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posts Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {popularPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group hover:text-primary transition-colors"
                  >
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:underline">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {post.publishedAt && (
                        <span>{formatDateShort(new Date(post.publishedAt))}</span>
                      )}
                      <span>•</span>
                      <span>{post.views} visualizações</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </aside>
  )
}


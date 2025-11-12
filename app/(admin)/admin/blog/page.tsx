import Link from 'next/link'
import { Plus, FileText, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/lib/db'

const categoryLabels: Record<string, string> = {
  INVESTIMENTOS: 'Investimentos',
  MERCADO_IMOBILIARIO: 'Mercado Imobiliário',
  FINANCIAMENTOS: 'Financiamentos',
  DICAS_COMPRADORES: 'Dicas para Compradores',
  VALORIZACAO_BAIRROS: 'Valorização por Bairro',
  TENDENCIAS: 'Tendências',
  GUIA_COMPRADOR: 'Guia do Comprador',
}

async function getBlogPosts() {
  return db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      published: true,
      featured: true,
      publishedAt: true,
      views: true,
      author: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blog Posts</h1>
          <p className="text-muted-foreground">
            Gerencie todos os posts do blog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      {post.featured && (
                        <Badge variant="default" className="text-xs">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>
                        {categoryLabels[post.category] || post.category}
                      </span>
                      <span>•</span>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.views} visualizações</span>
                      {post.publishedAt && (
                        <>
                          <span>•</span>
                          <span>
                            {new Intl.DateTimeFormat('pt-BR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }).format(new Date(post.publishedAt))}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge
                      variant={post.published ? 'default' : 'secondary'}
                    >
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Criado em{' '}
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(new Date(post.createdAt))}
                  </div>
                  <div className="flex gap-2">
                    {post.published && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blog/${post.id}/editar`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum post criado ainda
            </p>
            <Button asChild>
              <Link href="/admin/blog/novo">
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


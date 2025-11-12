import { Metadata } from 'next'
import { db } from '@/lib/db'
import { SITE_CONFIG } from '@/lib/constants'
import { BlogCard } from '@/components/blog/blog-card'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import { Suspense } from 'react'
import { BlogSearch } from '@/components/blog/blog-search'

export const metadata: Metadata = {
  title: 'Blog - Dicas e Notícias sobre Imóveis | Gabriel Alberto Imóveis',
  description:
    'Aprenda sobre investimentos imobiliários, mercado imobiliário em São Paulo, financiamentos e dicas para compradores. Conteúdo atualizado e especializado.',
  openGraph: {
    title: 'Blog - Gabriel Alberto Imóveis',
    description:
      'Aprenda sobre investimentos imobiliários, mercado imobiliário em São Paulo, financiamentos e dicas para compradores.',
    type: 'website',
    url: `${SITE_CONFIG.url}/blog`,
  },
}

interface SearchParams {
  categoria?: string
  busca?: string
  pagina?: string
}

const POSTS_PER_PAGE = 12

async function getBlogPosts(searchParams: SearchParams) {
  const page = parseInt(searchParams.pagina || '1')
  const skip = (page - 1) * POSTS_PER_PAGE

  const where: any = {
    published: true,
  }

  if (searchParams.categoria) {
    where.category = searchParams.categoria
  }

  if (searchParams.busca) {
    where.OR = [
      { title: { contains: searchParams.busca, mode: 'insensitive' } },
      { excerpt: { contains: searchParams.busca, mode: 'insensitive' } },
      { content: { contains: searchParams.busca, mode: 'insensitive' } },
    ]
  }

  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: POSTS_PER_PAGE,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        category: true,
        publishedAt: true,
        readingTime: true,
        author: true,
      },
    }),
    db.blogPost.count({ where }),
  ])

  return { posts, total, page, totalPages: Math.ceil(total / POSTS_PER_PAGE) }
}

async function getCategories() {
  const categories = await db.blogPost.groupBy({
    by: ['category'],
    where: { published: true },
    _count: { category: true },
  })

  return categories.map((cat) => ({
    category: cat.category,
    count: cat._count.category,
  }))
}

async function getPopularPosts() {
  return db.blogPost.findMany({
    where: { published: true },
    orderBy: { views: 'desc' },
    take: 5,
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      views: true,
    },
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const { posts, total, page, totalPages } = await getBlogPosts(
    resolvedSearchParams
  )
  const categories = await getCategories()
  const popularPosts = await getPopularPosts()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Dicas, notícias e guias sobre o mercado imobiliário em São Paulo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Carregando...</div>}>
            <BlogSearch initialSearch={resolvedSearchParams.busca} />
          </Suspense>

          {resolvedSearchParams.categoria && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Filtrado por categoria: <strong>{resolvedSearchParams.categoria}</strong>
              </p>
            </div>
          )}

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Button
                      variant="outline"
                      asChild
                    >
                      <a
                        href={`/blog?${new URLSearchParams({
                          ...resolvedSearchParams,
                          pagina: String(page - 1),
                        }).toString()}`}
                      >
                        Anterior
                      </a>
                    </Button>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages && (
                    <Button
                      variant="outline"
                      asChild
                    >
                      <a
                        href={`/blog?${new URLSearchParams({
                          ...resolvedSearchParams,
                          pagina: String(page + 1),
                        }).toString()}`}
                      >
                        Próxima
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum post encontrado.
              </p>
              {resolvedSearchParams.busca && (
                <p className="text-sm text-muted-foreground mt-2">
                  Tente buscar por outros termos.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <BlogSidebar categories={categories} popularPosts={popularPosts} />
        </aside>
      </div>
    </div>
  )
}


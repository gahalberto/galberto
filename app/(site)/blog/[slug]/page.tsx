import { notFound } from 'next/navigation'
import Image from 'next/image'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SITE_CONFIG } from '@/lib/constants'
import {
  generateBlogPostJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
} from '@/lib/seo'
import type { Metadata } from 'next'
import { BlogCTA } from '@/components/blog/blog-cta'
import { BlogFAQ } from '@/components/blog/blog-faq'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { MarkdownContent } from '@/components/blog/markdown-content'
import { Calendar, Clock, User } from 'lucide-react'
import { BlogViewTracker } from '@/components/blog/blog-view-tracker'

export const revalidate = 3600 // 1 hour

interface BlogPostPageProps {
  params: Promise<{
    slug: string
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

async function getBlogPost(slug: string) {
  const post = await db.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) return null

  // Incrementar views (assíncrono, não bloqueia a resposta)
  db.blogPost
    .update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
    .catch(console.error)

  return post
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

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt.slice(0, 160)
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`
  // Usar OG image dinâmico se não houver coverImage
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : `${SITE_CONFIG.url}${post.coverImage}`
    : `${SITE_CONFIG.url}/api/og/blog?title=${encodeURIComponent(post.title)}&excerpt=${encodeURIComponent(post.excerpt)}&category=${encodeURIComponent(post.category)}&author=${encodeURIComponent(post.author)}`

  return {
    title,
    description,
    keywords: post.keywords,
    alternates: {
      canonical: post.canonicalUrl || url,
      languages: {
        'pt-BR': url,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      section: categoryLabels[post.category] || post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const categories = await getCategories()
  const popularPosts = await getPopularPosts()

  const imageUrl = post.coverImage
    ? post.coverImage.startsWith('http')
      ? post.coverImage
      : post.coverImage
    : '/images/imagem-social.png'

  const faqs = post.faq
    ? (Array.isArray(post.faq) ? post.faq : [])
    : []

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogPostJsonLd({ post })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs)),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateFAQJsonLd({
                faqs: faqs as Array<{ question: string; answer: string }>,
              })
            ),
          }}
        />
      )}

      <BlogViewTracker postId={post.id} />

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conteúdo Principal */}
          <article className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li>
                  <a href="/" className="hover:text-foreground">
                    Home
                  </a>
                </li>
                <li>/</li>
                <li>
                  <a href="/blog" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>/</li>
                <li className="text-foreground">{post.title}</li>
              </ol>
            </nav>

            {/* Header do Post */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {categoryLabels[post.category] || post.category}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.publishedAt.toISOString()}>
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(post.publishedAt))}
                    </time>
                  </div>
                )}
                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} min de leitura</span>
                  </div>
                )}
              </div>
            </header>

            {/* Imagem de Capa */}
            {post.coverImage && (
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                />
              </div>
            )}

            <Separator className="mb-8" />

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none">
              <MarkdownContent content={post.content} />
            </div>

            {/* FAQ Section */}
            {faqs.length > 0 && <BlogFAQ faqs={faqs as Array<{ question: string; answer: string }>} />}

            {/* CTA */}
            <BlogCTA />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <BlogSidebar categories={categories} popularPosts={popularPosts} />
          </aside>
        </div>
      </div>
    </>
  )
}


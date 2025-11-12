'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const blogPostSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
  excerpt: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres'),
  content: z.string().min(50, 'Conteúdo deve ter pelo menos 50 caracteres'),
  category: z.enum([
    'INVESTIMENTOS',
    'MERCADO_IMOBILIARIO',
    'FINANCIAMENTOS',
    'DICAS_COMPRADORES',
    'VALORIZACAO_BAIRROS',
    'TENDENCIAS',
    'GUIA_COMPRADOR',
  ]),
  coverImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  author: z.string().optional(),
  authorBio: z.string().optional(),
  publishedAt: z.string().optional(),
  readingTime: z.number().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
})

export async function createBlogPost(data: z.infer<typeof blogPostSchema>) {
  try {
    const validated = blogPostSchema.parse(data)

    // Verificar se slug já existe
    const existing = await db.blogPost.findUnique({
      where: { slug: validated.slug },
    })

    if (existing) {
      return {
        error: 'Um post com este slug já existe',
      }
    }

    const post = await db.blogPost.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        content: validated.content,
        category: validated.category,
        coverImage: validated.coverImage || null,
        metaTitle: validated.metaTitle || null,
        metaDescription: validated.metaDescription || null,
        keywords: validated.keywords || [],
        canonicalUrl: validated.canonicalUrl || null,
        ogImage: validated.ogImage || null,
        author: validated.author || 'Gabriel Alberto',
        authorBio: validated.authorBio || null,
        publishedAt: validated.publishedAt
          ? new Date(validated.publishedAt)
          : validated.published
          ? new Date()
          : null,
        readingTime: validated.readingTime || null,
        published: validated.published,
        featured: validated.featured,
        faq: validated.faq || null,
      },
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    revalidatePath(`/blog/${post.slug}`)

    return { success: true, post }
  } catch (error) {
    console.error('Error creating blog post:', error)
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(', '),
      }
    }
    return {
      error: 'Erro ao criar post',
    }
  }
}

export async function updateBlogPost(
  id: string,
  data: z.infer<typeof blogPostSchema>
) {
  try {
    const validated = blogPostSchema.parse(data)

    // Verificar se slug já existe em outro post
    const existing = await db.blogPost.findFirst({
      where: {
        slug: validated.slug,
        NOT: { id },
      },
    })

    if (existing) {
      return {
        error: 'Um post com este slug já existe',
      }
    }

    const post = await db.blogPost.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        content: validated.content,
        category: validated.category,
        coverImage: validated.coverImage || null,
        metaTitle: validated.metaTitle || null,
        metaDescription: validated.metaDescription || null,
        keywords: validated.keywords || [],
        canonicalUrl: validated.canonicalUrl || null,
        ogImage: validated.ogImage || null,
        author: validated.author || 'Gabriel Alberto',
        authorBio: validated.authorBio || null,
        publishedAt: validated.publishedAt
          ? new Date(validated.publishedAt)
          : validated.published && !validated.publishedAt
          ? new Date()
          : undefined,
        readingTime: validated.readingTime || null,
        published: validated.published,
        featured: validated.featured,
        faq: validated.faq || null,
      },
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    revalidatePath(`/blog/${post.slug}`)

    return { success: true, post }
  } catch (error) {
    console.error('Error updating blog post:', error)
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(', '),
      }
    }
    return {
      error: 'Erro ao atualizar post',
    }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await db.blogPost.delete({
      where: { id },
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blog')

    return { success: true }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return {
      error: 'Erro ao deletar post',
    }
  }
}


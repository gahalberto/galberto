'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus, X } from 'lucide-react'
import { createBlogPost, updateBlogPost } from '@/app/(admin)/admin/blog/actions'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'

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
  keywords: z.string().optional(), // String separada por vírgulas
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  author: z.string().optional(),
  authorBio: z.string().optional(),
  publishedAt: z.string().optional(),
  readingTime: z.string().optional(), // String que será convertida para number
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

type BlogPostFormData = z.infer<typeof blogPostSchema>

interface BlogFormProps {
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    coverImage?: string | null
    metaTitle?: string | null
    metaDescription?: string | null
    keywords?: string[]
    canonicalUrl?: string | null
    ogImage?: string | null
    author?: string | null
    authorBio?: string | null
    publishedAt?: Date | null
    readingTime?: number | null
    published: boolean
    featured: boolean
    faq?: any
  }
}

const categoryOptions = [
  { value: 'INVESTIMENTOS', label: 'Investimentos' },
  { value: 'MERCADO_IMOBILIARIO', label: 'Mercado Imobiliário' },
  { value: 'FINANCIAMENTOS', label: 'Financiamentos' },
  { value: 'DICAS_COMPRADORES', label: 'Dicas para Compradores' },
  { value: 'VALORIZACAO_BAIRROS', label: 'Valorização por Bairro' },
  { value: 'TENDENCIAS', label: 'Tendências' },
  { value: 'GUIA_COMPRADOR', label: 'Guia do Comprador' },
]

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faqItems, setFaqItems] = useState<
    Array<{ question: string; answer: string }>
  >(
    post?.faq && Array.isArray(post.faq)
      ? (post.faq as Array<{ question: string; answer: string }>)
      : []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category as any,
          coverImage: post.coverImage || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          keywords: post.keywords?.join(', ') || '',
          canonicalUrl: post.canonicalUrl || '',
          ogImage: post.ogImage || '',
          author: post.author || 'Gabriel Alberto',
          authorBio: post.authorBio || '',
          publishedAt: post.publishedAt
            ? new Date(post.publishedAt).toISOString().split('T')[0]
            : '',
          readingTime: post.readingTime?.toString() || '',
          published: post.published,
          featured: post.featured,
        }
      : {
          author: 'Gabriel Alberto',
          published: false,
          featured: false,
        },
  })

  const watchedTitle = watch('title')

  // Gerar slug automaticamente do título
  useEffect(() => {
    if (!post && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setValue('slug', slug)
    }
  }, [watchedTitle, post, setValue])

  async function onSubmit(data: BlogPostFormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Converter keywords de string para array
      const keywords = data.keywords
        ? data.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : []

      // Converter readingTime de string para number
      const readingTime = data.readingTime
        ? parseInt(data.readingTime, 10)
        : undefined

      const postData = {
        ...data,
        keywords,
        readingTime,
        faq: faqItems.length > 0 ? faqItems : undefined,
      }

      let result
      if (post) {
        result = await updateBlogPost(post.id, postData as any)
      } else {
        result = await createBlogPost(postData as any)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/blog')
        router.refresh()
      }
    } catch (err) {
      setError('Erro ao salvar post')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  function addFaqItem() {
    setFaqItems([...faqItems, { question: '', answer: '' }])
  }

  function removeFaqItem(index: number) {
    setFaqItems(faqItems.filter((_, i) => i !== index))
  }

  function updateFaqItem(
    index: number,
    field: 'question' | 'answer',
    value: string
  ) {
    const updated = [...faqItems]
    updated[index][field] = value
    setFaqItems(updated)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Guia Completo para Comprar seu Primeiro Imóvel"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="exemplo-slug-do-post"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo *</Label>
            <Textarea
              id="excerpt"
              {...register('excerpt')}
              placeholder="Breve descrição do post (aparece na listagem)"
              rows={3}
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              onValueChange={(value) => setValue('category', value as any)}
              defaultValue={post?.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo (Markdown) *</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Escreva o conteúdo do post em Markdown..."
              rows={20}
              className="font-mono text-sm"
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            value={watch('coverImage') || ''}
            onChange={(url) => setValue('coverImage', url)}
            type="posts"
            label="Imagem de Capa"
          />
          {watch('coverImage') && (
            <Input
              {...register('coverImage')}
              placeholder="Ou cole uma URL aqui"
              className="text-sm"
            />
          )}

          <ImageUpload
            value={watch('ogImage') || ''}
            onChange={(url) => setValue('ogImage', url)}
            type="posts"
            label="OG Image (opcional - para redes sociais)"
          />
          {watch('ogImage') && (
            <Input
              {...register('ogImage')}
              placeholder="Ou cole uma URL aqui"
              className="text-sm"
            />
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title (opcional)</Label>
            <Input
              id="metaTitle"
              {...register('metaTitle')}
              placeholder="Título para SEO (padrão: usa o título do post)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description (opcional)</Label>
            <Textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="Descrição para SEO (padrão: usa o resumo)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (separadas por vírgula)</Label>
            <Input
              id="keywords"
              {...register('keywords')}
              placeholder="investimento, imóveis, São Paulo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL (opcional)</Label>
            <Input
              id="canonicalUrl"
              {...register('canonicalUrl')}
              placeholder="https://exemplo.com/post-original"
            />
          </div>
        </CardContent>
      </Card>

      {/* Autor e Publicação */}
      <Card>
        <CardHeader>
          <CardTitle>Autor e Publicação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              {...register('author')}
              placeholder="Gabriel Alberto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorBio">Biografia do Autor (opcional)</Label>
            <Textarea
              id="authorBio"
              {...register('authorBio')}
              placeholder="Breve biografia do autor"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt">Data de Publicação</Label>
            <Input
              id="publishedAt"
              type="date"
              {...register('publishedAt')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="readingTime">Tempo de Leitura (minutos)</Label>
            <Input
              id="readingTime"
              type="number"
              {...register('readingTime')}
              placeholder="5"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={watch('published')}
              onCheckedChange={(checked) => setValue('published', !!checked)}
            />
            <Label htmlFor="published" className="cursor-pointer">
              Publicado
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={watch('featured')}
              onCheckedChange={(checked) => setValue('featured', !!checked)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Destaque
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Perguntas Frequentes (opcional)</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFaqItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma pergunta frequente adicionada
            </p>
          ) : (
            faqItems.map((faq, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>FAQ #{index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaqItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Pergunta"
                  value={faq.question}
                  onChange={(e) =>
                    updateFaqItem(index, 'question', e.target.value)
                  }
                />
                <Textarea
                  placeholder="Resposta"
                  value={faq.answer}
                  onChange={(e) =>
                    updateFaqItem(index, 'answer', e.target.value)
                  }
                  rows={3}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : post ? (
            'Atualizar Post'
          ) : (
            'Criar Post'
          )}
        </Button>
      </div>
    </form>
  )
}


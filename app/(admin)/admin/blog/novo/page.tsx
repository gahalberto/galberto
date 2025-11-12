import { BlogForm } from '@/components/admin/blog-form'

export default function NovoBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Novo Post do Blog</h1>
        <p className="text-muted-foreground">
          Crie um novo post para o blog
        </p>
      </div>
      <BlogForm />
    </div>
  )
}


import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { BlogForm } from '@/components/admin/blog-form'

interface EditBlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

async function getBlogPost(id: string) {
  return db.blogPost.findUnique({
    where: { id },
  })
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Editar Post</h1>
        <p className="text-muted-foreground">
          Edite as informações do post: {post.title}
        </p>
      </div>
      <BlogForm post={post} />
    </div>
  )
}


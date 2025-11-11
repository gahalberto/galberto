import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminNav } from '@/components/admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav user={session.user as any} />
      <main className="container py-8">{children}</main>
    </div>
  )
}


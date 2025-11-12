'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useState, useTransition } from 'react'

interface BlogSearchProps {
  initialSearch?: string
}

export function BlogSearch({ initialSearch }: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch || '')
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set('busca', search.trim())
    } else {
      params.delete('busca')
    }
    params.delete('pagina') // Reset to page 1
    startTransition(() => {
      router.push(`/blog?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar artigos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </form>
  )
}


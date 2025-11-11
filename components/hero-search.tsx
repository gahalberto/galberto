'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from '@/components/ui/command'

interface SearchResult {
  type: 'neighborhood' | 'region'
  id: number
  name: string
  slug?: string
}

export function HeroSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // São Paulo tem ID 3 conforme o JSON
  const saoPauloCityId = 3

  useEffect(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (search.length < 2) {
      setResults([])
      return
    }

    setLoading(true)

    // Debounce da busca
    timeoutRef.current = setTimeout(async () => {
      try {
        // Buscar bairros, regiões e ruas
        const [neighborhoodsRes, regionsRes] = await Promise.all([
          fetch(`/api/location?type=neighborhoods&cityId=${saoPauloCityId}`).catch(() => null),
          fetch(`/api/location?type=regions`).catch(() => null),
        ])

        const allResults: SearchResult[] = []

        // Processar regiões primeiro (zonas aparecem primeiro)
        if (regionsRes?.ok) {
          const regions = await regionsRes.json()
          const filtered = regions
            .filter((r: any) => 
              r.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((r: any) => ({
              type: 'region' as const,
              id: r.id,
              name: r.name,
            }))
          allResults.push(...filtered)
        }

        // Processar bairros depois
        if (neighborhoodsRes?.ok) {
          const neighborhoods = await neighborhoodsRes.json()
          const filtered = neighborhoods
            .filter((n: any) => 
              n.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((n: any) => ({
              type: 'neighborhood' as const,
              id: n.id,
              name: n.name,
              slug: n.slug,
            }))
          allResults.push(...filtered)
        }

        setResults(allResults.slice(0, 10)) // Limitar a 10 resultados
      } catch (error) {
        console.error('Erro ao buscar:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [search])

  const handleSelect = (result: SearchResult) => {
    setSelectedResult(result)
    setOpen(false)
    
    // Redirecionar para a página de imóveis com o filtro
    const params = new URLSearchParams()
    
    if (result.type === 'neighborhood') {
      params.set('neighborhood', result.name)
    } else if (result.type === 'region') {
      params.set('region', result.name)
    }
    
    router.push(`/imoveis?${params.toString()}`)
  }

  const handleSearch = () => {
    if (selectedResult) {
      handleSelect(selectedResult)
    } else if (search.length >= 2 && results.length > 0) {
      handleSelect(results[0])
    } else if (search.length >= 2) {
      // Se não houver resultados, buscar por texto livre
      const params = new URLSearchParams()
      params.set('search', search)
      router.push(`/imoveis?${params.toString()}`)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col md:flex-row gap-2 relative">
        <div className="relative flex-1 w-full">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
            <Input
            placeholder="Buscar por bairro ou zona..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={(e) => {
              // Não fechar se estiver clicando nos resultados
              const relatedTarget = e.relatedTarget as HTMLElement
              if (relatedTarget?.closest('.search-results')) {
                return
              }
              // Delay para permitir clique nos resultados
              setTimeout(() => {
                // Verificar se o foco não voltou para o input ou dropdown
                const activeElement = document.activeElement
                if (!activeElement?.closest('.search-results') && activeElement !== e.target) {
                  setOpen(false)
                }
              }, 200)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              } else if (e.key === 'Escape') {
                setOpen(false)
              }
            }}
            className="pl-10 h-12 text-base bg-white/95 backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
          />
          
          {/* Dropdown de resultados */}
          {open && (search.length >= 2 || results.length > 0) && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border shadow-lg z-50 max-h-80 overflow-auto search-results"
              onMouseDown={(e) => {
                // Prevenir blur do input quando clicar no dropdown
                e.preventDefault()
              }}
            >
              <Command shouldFilter={false}>
                <CommandList>
                  {loading && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  )}
                  {!loading && results.length === 0 && search.length >= 2 && (
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                  )}
                  {!loading && search.length < 2 && (
                    <CommandEmpty>Digite pelo menos 2 caracteres para buscar.</CommandEmpty>
                  )}
                  {results.length > 0 && (
                    <CommandGroup>
                      {results.map((result) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          onClick={() => {
                            handleSelect(result)
                          }}
                          className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm"
                        >
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{result.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {result.type === 'neighborhood' && 'Bairro'}
                              {result.type === 'region' && 'Zona'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </div>
          )}
        </div>
        <Button
          size="lg"
          onClick={handleSearch}
          className="h-12 px-8 bg-primary hover:bg-primary/90 w-full md:w-auto"
        >
          <Search className="mr-2 h-5 w-5" />
          Buscar
        </Button>
      </div>
    </div>
  )
}


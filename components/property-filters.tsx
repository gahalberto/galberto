'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PROPERTY_FILTERS } from '@/lib/constants'
import { X } from 'lucide-react'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to page 1
    router.push(`/imoveis?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/imoveis')
  }

  const hasActiveFilters = searchParams.toString().length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo */}
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            value={searchParams.get('purpose') || ''}
            onValueChange={(value) => updateFilter('purpose', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {PROPERTY_FILTERS.purposes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={searchParams.get('status') || ''}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {PROPERTY_FILTERS.statuses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quartos */}
        <div className="space-y-2">
          <Label>Quartos</Label>
          <Select
            value={searchParams.get('bedrooms') || ''}
            onValueChange={(value) => updateFilter('bedrooms', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {PROPERTY_FILTERS.bedrooms.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vagas */}
        <div className="space-y-2">
          <Label>Vagas</Label>
          <Select
            value={searchParams.get('parkingSpots') || ''}
            onValueChange={(value) => updateFilter('parkingSpots', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {PROPERTY_FILTERS.parkingSpots.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Faixa de Preço */}
        <div className="space-y-2">
          <Label>Faixa de Preço</Label>
          <Select
            value={
              searchParams.get('priceMin') && searchParams.get('priceMax')
                ? `${searchParams.get('priceMin')}-${searchParams.get('priceMax')}`
                : ''
            }
            onValueChange={(value) => {
              if (value) {
                const [min, max] = value.split('-')
                updateFilter('priceMin', min)
                updateFilter('priceMax', max)
              } else {
                updateFilter('priceMin', '')
                updateFilter('priceMax', '')
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {PROPERTY_FILTERS.priceRanges.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Airbnb */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="airbnb"
            checked={searchParams.get('airbnb') === 'true'}
            onChange={(e) =>
              updateFilter('airbnb', e.target.checked ? 'true' : '')
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="airbnb" className="cursor-pointer">
            Permite Airbnb
          </Label>
        </div>

        {/* Ordenação */}
        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select
            value={searchParams.get('sort') || 'newest'}
            onValueChange={(value) => updateFilter('sort', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_FILTERS.sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}


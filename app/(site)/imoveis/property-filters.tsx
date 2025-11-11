'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PROPERTY_FILTERS } from '@/lib/constants'
import { Search, X } from 'lucide-react'

interface PropertyFiltersProps {
  districts: string[]
}

export function PropertyFilters({ districts }: PropertyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    district: searchParams.get('district') || '',
    purpose: searchParams.get('purpose') || '',
    status: searchParams.get('status') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    parkingSpots: searchParams.get('parkingSpots') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    allowAirbnb: searchParams.get('allowAirbnb') || '',
    sort: searchParams.get('sort') || 'newest',
  })

  function updateFilters(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    startTransition(() => {
      router.push(`/imoveis?${params.toString()}`)
    })
  }

  function clearFilters() {
    setFilters({
      search: '',
      district: '',
      purpose: '',
      status: '',
      bedrooms: '',
      parkingSpots: '',
      minPrice: '',
      maxPrice: '',
      allowAirbnb: '',
      sort: 'newest',
    })
    startTransition(() => {
      router.push('/imoveis')
    })
  }

  const hasFilters = Object.values(filters).some((v) => v && v !== 'newest')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Título, bairro..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilters('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
        </div>

        <Separator />

        {/* Purpose */}
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            value={filters.purpose}
            onValueChange={(value) => updateFilters('purpose', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Venda ou Aluguel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {PROPERTY_FILTERS.purposes.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilters('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lançamento, Pronto..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {PROPERTY_FILTERS.statuses.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        {districts.length > 0 && (
          <div className="space-y-2">
            <Label>Bairro</Label>
            <Select
              value={filters.district}
              onValueChange={(value) => updateFilters('district', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Quartos (mínimo)</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => updateFilters('bedrooms', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer</SelectItem>
              {PROPERTY_FILTERS.bedrooms.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Parking */}
        <div className="space-y-2">
          <Label>Vagas (mínimo)</Label>
          <Select
            value={filters.parkingSpots}
            onValueChange={(value) => updateFilters('parkingSpots', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer</SelectItem>
              {PROPERTY_FILTERS.parkingSpots.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Faixa de Preço</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Mín"
              type="number"
              value={filters.minPrice}
              onChange={(e) => updateFilters('minPrice', e.target.value)}
            />
            <Input
              placeholder="Máx"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Airbnb */}
        <div className="space-y-2">
          <Label>Permite Airbnb</Label>
          <Select
            value={filters.allowAirbnb}
            onValueChange={(value) => updateFilters('allowAirbnb', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer</SelectItem>
              <SelectItem value="true">Sim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Sort */}
        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => updateFilters('sort', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_FILTERS.sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 pt-2">
          <Button
            className="w-full"
            onClick={applyFilters}
            disabled={isPending}
          >
            {isPending ? 'Aplicando...' : 'Aplicar Filtros'}
          </Button>
          {hasFilters && (
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
              disabled={isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


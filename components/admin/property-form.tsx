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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus, X, Trash2 } from 'lucide-react'
import { createProperty, updateProperty } from '@/app/(admin)/admin/imoveis/actions'
import { ImageUpload } from '@/components/ui/image-upload'

const propertyFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['LANCAMENTO', 'EM_OBRAS', 'PRONTO']),
  purpose: z.enum(['VENDA', 'ALUGUEL']),
  price: z.string().optional(),
  condoFee: z.string().optional(),
  iptuYearly: z.string().optional(),
  areaTotal: z.string().optional(),
  areaPrivate: z.string().optional(),
  bedrooms: z.string().optional(),
  suites: z.string().optional(),
  bathrooms: z.string().optional(),
  parkingSpots: z.string().optional(),
  floor: z.string().optional(),
  yearBuilt: z.string().optional(),
  deliveryDate: z.string().optional(),
  allowAirbnb: z.boolean(),
  published: z.boolean(),
  featured: z.boolean(),
  developer: z.string().optional(),
  realtorName: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  highlights: z.array(z.string()),
  lat: z.string().optional(),
  lng: z.string().optional(),
  street: z.string().min(3, 'Rua é obrigatória'),
  streetNumber: z.string().optional(),
  complement: z.string().optional(),
  postalCode: z.string().min(8, 'CEP é obrigatório'),
  stateId: z.string().min(1, 'Estado é obrigatório'),
  cityId: z.string().min(1, 'Cidade é obrigatória'),
  neighborhoodId: z.string().min(1, 'Bairro é obrigatório'),
  regionId: z.string().optional(),
  // Campos legacy (para compatibilidade)
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  number: z.string().optional(),
  country: z.string().default('Brasil'),
  amenities: z.array(z.string()),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    position: z.number(),
  })),
})

type PropertyFormData = z.infer<typeof propertyFormSchema>

interface PropertyFormProps {
  property?: any
  amenities: Array<{ id: string; name: string; icon?: string; category?: string }>
}

export function PropertyForm({ property, amenities }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [highlightInput, setHighlightInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  
  // Estados para selects hierárquicos
  const [states, setStates] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])
  const [neighborhoods, setNeighborhoods] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [regions, setRegions] = useState<Array<{ id: string; name: string }>>([])
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema) as any,
    defaultValues: property
      ? {
          title: property.title || '',
          description: property.description || '',
          status: property.status || 'LANCAMENTO',
          purpose: property.purpose || 'VENDA',
          price: property.price?.toString() || '',
          condoFee: property.condoFee?.toString() || '',
          iptuYearly: property.iptuYearly?.toString() || '',
          areaTotal: property.areaTotal?.toString() || '',
          areaPrivate: property.areaPrivate?.toString() || '',
          bedrooms: property.bedrooms?.toString() || '',
          suites: property.suites?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          parkingSpots: property.parkingSpots?.toString() || '',
          floor: property.floor?.toString() || '',
          yearBuilt: property.yearBuilt?.toString() || '',
          deliveryDate: property.deliveryDate
            ? new Date(property.deliveryDate).toISOString().split('T')[0]
            : '',
          allowAirbnb: Boolean(property.allowAirbnb),
          published: Boolean(property.published),
          featured: Boolean(property.featured),
          developer: property.developer || '',
          realtorName: property.realtorName || 'Gabriel Alberto',
          canonicalUrl: property.canonicalUrl || '',
          ogImage: property.ogImage || '',
          highlights: Array.isArray(property.highlights) ? property.highlights : [],
          lat: property.lat?.toString() || '',
          lng: property.lng?.toString() || '',
          street: property.address?.street || '',
          streetNumber: property.address?.streetNumber || property.address?.number || '',
          complement: property.address?.complement || '',
          postalCode: property.address?.postalCode || property.address?.zipcode || '',
          stateId: property.address?.neighborhood?.city?.stateId?.toString() || '',
          cityId: property.address?.neighborhood?.cityId?.toString() || '',
          neighborhoodId: property.address?.neighborhoodId?.toString() || '',
          regionId: property.address?.neighborhood?.regionId?.toString() || '',
          // Campos legacy (para compatibilidade)
          district: property.address?.district || '',
          city: property.address?.city || property.address?.neighborhood?.city?.name || '',
          state: property.address?.state || property.address?.neighborhood?.city?.state?.code || '',
          zipcode: property.address?.zipcode || property.address?.postalCode || '',
          number: property.address?.number || property.address?.streetNumber || '',
          country: property.address?.country || 'Brasil',
          amenities: Array.isArray(property.amenities) ? property.amenities.map((a: any) => a.amenityId || a) : [],
          images: Array.isArray(property.images) ? property.images.filter((img: any) => img?.url).map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || undefined,
            position: typeof img.position === 'number' ? img.position : index,
          })) : [],
        }
      : {
          title: '',
          description: '',
          status: 'PRONTO',
          purpose: 'VENDA',
          allowAirbnb: false,
          published: false,
          featured: false,
          highlights: [],
          amenities: [],
          images: [],
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          realtorName: 'Gabriel Alberto',
          street: '',
          postalCode: '',
          stateId: '',
          cityId: '',
          neighborhoodId: '',
        },
  })

  const watchedHighlights = watch('highlights')
  const watchedImages = watch('images')
  const watchedAmenities = watch('amenities')
  const watchedStateId = watch('stateId')
  const watchedCityId = watch('cityId')

  // Carregar estados e regiões ao montar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingStates(true)
        console.log('Carregando estados e regiões...')
        const [statesRes, regionsRes] = await Promise.all([
          fetch('/api/location?type=states'),
          fetch('/api/location?type=regions'),
        ])
        
        if (!statesRes.ok) {
          const errorText = await statesRes.text()
          console.error('Error fetching states:', statesRes.status, statesRes.statusText, errorText)
          setLoadingStates(false)
          return
        }
        
        if (!regionsRes.ok) {
          const errorText = await regionsRes.text()
          console.error('Error fetching regions:', regionsRes.status, regionsRes.statusText, errorText)
        }
        
        const statesData = await statesRes.json()
        const regionsData = await regionsRes.ok ? await regionsRes.json() : []
        
        console.log('States loaded:', statesData.length, statesData)
        console.log('Regions loaded:', regionsData.length, regionsData)
        
        if (Array.isArray(statesData)) {
          setStates(statesData)
        } else {
          console.error('States data is not an array:', statesData)
        }
        
        if (Array.isArray(regionsData)) {
          setRegions(regionsData)
        } else {
          console.error('Regions data is not an array:', regionsData)
        }
        
        setLoadingStates(false)
      } catch (error) {
        console.error('Error loading initial data:', error)
        setLoadingStates(false)
      }
    }
    loadInitialData()
  }, [])

  // Carregar cidades quando o estado mudar
  useEffect(() => {
    if (watchedStateId) {
      setLoadingCities(true)
      fetch(`/api/location?type=cities&stateId=${watchedStateId}`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data)
          setLoadingCities(false)
          // Resetar cidade e bairro quando estado mudar
          setValue('cityId', '')
          setValue('neighborhoodId', '')
          setNeighborhoods([])
        })
        .catch((error) => {
          console.error('Error loading cities:', error)
          setLoadingCities(false)
        })
    } else {
      setCities([])
      setNeighborhoods([])
    }
  }, [watchedStateId, setValue])

  // Carregar bairros quando a cidade mudar
  useEffect(() => {
    if (watchedCityId) {
      setLoadingNeighborhoods(true)
      fetch(`/api/location?type=neighborhoods&cityId=${watchedCityId}`)
        .then((res) => res.json())
        .then((data) => {
          setNeighborhoods(data)
          setLoadingNeighborhoods(false)
          // Resetar bairro quando cidade mudar
          setValue('neighborhoodId', '')
        })
        .catch((error) => {
          console.error('Error loading neighborhoods:', error)
          setLoadingNeighborhoods(false)
        })
    } else {
      setNeighborhoods([])
    }
  }, [watchedCityId, setValue])

  // Carregar cidades e bairros se já tiver valores iniciais (modo edição)
  useEffect(() => {
    if (property?.address?.neighborhood?.cityId) {
      const stateId = property.address.neighborhood.city.stateId
      const cityId = property.address.neighborhood.cityId
      
      // Carregar cidades do estado
      fetch(`/api/location?type=cities&stateId=${stateId}`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data)
          // Carregar bairros da cidade
          return fetch(`/api/location?type=neighborhoods&cityId=${cityId}`)
        })
        .then((res) => res.json())
        .then((data) => {
          setNeighborhoods(data)
        })
        .catch((error) => {
          console.error('Error loading initial location data:', error)
        })
    }
  }, [property])

  const addHighlight = () => {
    if (highlightInput.trim()) {
      const current = watch('highlights')
      setValue('highlights', [...current, highlightInput.trim()])
      setHighlightInput('')
    }
  }

  const removeHighlight = (index: number) => {
    const current = watch('highlights')
    setValue('highlights', current.filter((_: string, i: number) => i !== index))
  }

  const addImage = () => {
    if (imageInput.trim()) {
      try {
        new URL(imageInput.trim())
        const current = watch('images')
        setValue('images', [
          ...current,
          { url: imageInput.trim(), alt: '', position: current.length },
        ])
        setImageInput('')
      } catch {
        setError('URL da imagem inválida')
      }
    }
  }

  const removeImage = (index: number) => {
    const current = watch('images')
    setValue('images', current.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString())
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      let result
      if (property) {
        result = await updateProperty(property.id, formData)
      } else {
        result = await createProperty(formData)
      }

      if (result.success) {
        router.push('/admin/imoveis')
        router.refresh()
      } else {
        setError(result.error || 'Erro ao salvar imóvel')
      }
    } catch (err) {
      setError('Erro ao salvar imóvel')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais do imóvel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Apartamento 2 quartos no Jardins"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={6}
                placeholder="Descreva o imóvel em detalhes..."
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANCAMENTO">Lançamento</SelectItem>
                  <SelectItem value="EM_OBRAS">Em Obras</SelectItem>
                  <SelectItem value="PRONTO">Pronto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="purpose">Finalidade *</Label>
              <Select
                value={watch('purpose')}
                onValueChange={(value) => setValue('purpose', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a finalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENDA">Venda</SelectItem>
                  <SelectItem value="ALUGUEL">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="Ex: 500000"
              />
            </div>

            <div>
              <Label htmlFor="condoFee">Condomínio (R$)</Label>
              <Input
                id="condoFee"
                type="number"
                step="0.01"
                {...register('condoFee')}
                placeholder="Ex: 800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
          <CardDescription>Detalhes do imóvel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input
                id="bedrooms"
                type="number"
                {...register('bedrooms')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="suites">Suítes</Label>
              <Input
                id="suites"
                type="number"
                {...register('suites')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input
                id="bathrooms"
                type="number"
                {...register('bathrooms')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="parkingSpots">Vagas</Label>
              <Input
                id="parkingSpots"
                type="number"
                {...register('parkingSpots')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="areaTotal">Área Total (m²)</Label>
              <Input
                id="areaTotal"
                type="number"
                step="0.01"
                {...register('areaTotal')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="areaPrivate">Área Privativa (m²)</Label>
              <Input
                id="areaPrivate"
                type="number"
                step="0.01"
                {...register('areaPrivate')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="floor">Andar</Label>
              <Input
                id="floor"
                type="number"
                {...register('floor')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="yearBuilt">Ano de Construção</Label>
              <Input
                id="yearBuilt"
                type="number"
                {...register('yearBuilt')}
                placeholder="2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="iptuYearly">IPTU Anual (R$)</Label>
              <Input
                id="iptuYearly"
                type="number"
                step="0.01"
                {...register('iptuYearly')}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate">Data de Entrega</Label>
              <Input
                id="deliveryDate"
                type="date"
                {...register('deliveryDate')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>Localização do imóvel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Rua *</Label>
              <Input
                id="street"
                {...register('street')}
                placeholder="Ex: Rua das Flores"
              />
              {errors.street && (
                <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="streetNumber">Número</Label>
              <Input
                id="streetNumber"
                {...register('streetNumber')}
                placeholder="123"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              {...register('complement')}
              placeholder="Apto, Bloco, etc"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stateId">Estado *</Label>
              {loadingStates ? (
                <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground">
                  Carregando estados...
                </div>
              ) : (
                <Combobox
                  options={states.map((state) => ({
                    value: state.id.toString(),
                    label: `${state.name} (${state.code})`,
                  }))}
                  value={watchedStateId || undefined}
                  onValueChange={(value) => {
                    setValue('stateId', value)
                  }}
                  placeholder="Selecione o estado"
                  searchPlaceholder="Buscar estado..."
                  emptyMessage="Nenhum estado encontrado"
              />
              )}
              {errors.stateId && (
                <p className="text-sm text-destructive mt-1">{errors.stateId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cityId">Cidade *</Label>
              <Combobox
                options={cities.map((city) => ({
                  value: city.id.toString(),
                  label: city.name,
                }))}
                value={watch('cityId') || undefined}
                onValueChange={(value) => {
                  setValue('cityId', value)
                }}
                placeholder={loadingCities ? 'Carregando...' : watchedStateId ? 'Selecione a cidade' : 'Selecione um estado primeiro'}
                searchPlaceholder="Buscar cidade..."
                emptyMessage="Nenhuma cidade encontrada"
                disabled={!watchedStateId || loadingCities}
              />
              {errors.cityId && (
                <p className="text-sm text-destructive mt-1">{errors.cityId.message}</p>
              )}
            </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhoodId">Bairro *</Label>
              <Combobox
                options={neighborhoods.map((neighborhood) => ({
                  value: neighborhood.id.toString(),
                  label: neighborhood.name,
                }))}
                value={watch('neighborhoodId') || undefined}
                onValueChange={(value) => {
                  setValue('neighborhoodId', value)
                }}
                placeholder={loadingNeighborhoods ? 'Carregando...' : watchedCityId ? 'Selecione o bairro' : 'Selecione uma cidade primeiro'}
                searchPlaceholder="Buscar bairro..."
                emptyMessage="Nenhum bairro encontrado"
                disabled={!watchedCityId || loadingNeighborhoods}
              />
              {errors.neighborhoodId && (
                <p className="text-sm text-destructive mt-1">{errors.neighborhoodId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="regionId">Região (Opcional)</Label>
              <Combobox
                options={regions.map((region) => ({
                  value: region.id.toString(),
                  label: region.name,
                }))}
                value={watch('regionId') || undefined}
                onValueChange={(value) => {
                  setValue('regionId', value || undefined)
                }}
                placeholder="Selecione a região (opcional)"
                searchPlaceholder="Buscar região..."
                emptyMessage="Nenhuma região encontrada"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">CEP *</Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                placeholder="00000-000"
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                {...register('country')}
                defaultValue="Brasil"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                {...register('lat')}
                placeholder="-23.5505"
              />
            </div>

            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                {...register('lng')}
                placeholder="-46.6333"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenidades */}
      <Card>
        <CardHeader>
          <CardTitle>Amenidades</CardTitle>
          <CardDescription>Selecione as amenidades do imóvel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenities.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded border hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={watchedAmenities.includes(amenity.id)}
                  onChange={(e) => {
                    const current = watch('amenities')
                    if (e.target.checked) {
                      setValue('amenities', [...current, amenity.id])
                    } else {
                      setValue('amenities', current.filter((id) => id !== amenity.id))
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">
                  {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                  {amenity.name}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Destaques */}
      <Card>
        <CardHeader>
          <CardTitle>Destaques</CardTitle>
          <CardDescription>Adicione pontos de destaque do imóvel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addHighlight()
                }
              }}
              placeholder="Ex: Vista para o mar"
            />
            <Button type="button" onClick={addHighlight} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedHighlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm"
              >
                <span>{highlight}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
          <CardDescription>Adicione URLs das imagens do imóvel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addImage()
                  }
                }}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Ou faça upload de uma imagem:
              </p>
              <ImageUpload
                value=""
                onChange={(url) => {
                  const current = watch('images')
                  setValue('images', [
                    ...current,
                    { url, alt: '', position: current.length },
                  ])
                }}
                type="properties"
                label="Upload de Imagem do Imóvel"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {watchedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.alt || `Imagem ${index + 1}`}
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Opções adicionais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="developer">Construtora/Empreendimento</Label>
              <Input
                id="developer"
                {...register('developer')}
                placeholder="Nome da construtora"
              />
            </div>

            <div>
              <Label htmlFor="realtorName">Nome do Corretor</Label>
              <Input
                id="realtorName"
                {...register('realtorName')}
                placeholder="Gabriel Alberto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="canonicalUrl">URL Canônica (SEO)</Label>
              <Input
                id="canonicalUrl"
                type="url"
                {...register('canonicalUrl')}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="ogImage">Imagem Open Graph (SEO)</Label>
              <ImageUpload
                value={watch('ogImage') || ''}
                onChange={(url) => setValue('ogImage', url)}
                type="properties"
                label=""
              />
              <Input
                id="ogImage"
                type="url"
                {...register('ogImage')}
                placeholder="Ou cole uma URL aqui"
                className="mt-2"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('allowAirbnb')}
                className="rounded"
              />
              <span>Permite Airbnb</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('published')}
                className="rounded"
              />
              <span>Publicado (visível no site)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="rounded"
              />
              <span>Destaque (aparece na home)</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {property ? 'Atualizar' : 'Criar'} Imóvel
        </Button>
      </div>
    </form>
  )
}


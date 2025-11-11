'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

const propertySchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['LANCAMENTO', 'EM_OBRAS', 'PRONTO']),
  purpose: z.enum(['VENDA', 'ALUGUEL']),
  price: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  condoFee: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  iptuYearly: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  areaTotal: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  areaPrivate: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  bedrooms: z.string().optional().transform((val) => (val ? parseInt(val) : null)),
  suites: z.string().optional().transform((val) => (val ? parseInt(val) : null)),
  bathrooms: z.string().optional().transform((val) => (val ? parseInt(val) : null)),
  parkingSpots: z.string().optional().transform((val) => (val ? parseInt(val) : null)),
  floor: z.string().optional().transform((val) => (val ? parseInt(val) : null)),
  yearBuilt: z.string().optional().transform((val) => (val ? parseInt(val) : null)),
  deliveryDate: z.string().optional().transform((val) => (val ? new Date(val) : null)),
  allowAirbnb: z.boolean().default(false),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  developer: z.string().optional(),
  realtorName: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  lat: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  lng: z.string().optional().transform((val) => (val ? parseFloat(val) : null)),
  // Address (nova estrutura hierárquica)
  street: z.string().min(3, 'Rua é obrigatória'),
  streetNumber: z.string().optional(),
  complement: z.string().optional(),
  postalCode: z.string().min(8, 'CEP é obrigatório'),
  stateId: z.string().min(1, 'Estado é obrigatório').transform((val) => parseInt(val, 10)),
  cityId: z.string().min(1, 'Cidade é obrigatória').transform((val) => parseInt(val, 10)),
  neighborhoodId: z.string().min(1, 'Bairro é obrigatório').transform((val) => parseInt(val, 10)),
  regionId: z.string().optional().transform((val) => (val ? parseInt(val, 10) : null)),
  // Campos legacy (para compatibilidade)
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  number: z.string().optional(),
  country: z.string().default('Brasil'),
  // Amenities
  amenities: z.array(z.string()).default([]),
  // Images
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().default(0),
  })).default([]),
})

export async function createProperty(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      purpose: formData.get('purpose'),
      price: formData.get('price'),
      condoFee: formData.get('condoFee'),
      iptuYearly: formData.get('iptuYearly'),
      areaTotal: formData.get('areaTotal'),
      areaPrivate: formData.get('areaPrivate'),
      bedrooms: formData.get('bedrooms'),
      suites: formData.get('suites'),
      bathrooms: formData.get('bathrooms'),
      parkingSpots: formData.get('parkingSpots'),
      floor: formData.get('floor'),
      yearBuilt: formData.get('yearBuilt'),
      deliveryDate: formData.get('deliveryDate'),
      allowAirbnb: formData.get('allowAirbnb') === 'true',
      published: formData.get('published') === 'true',
      featured: formData.get('featured') === 'true',
      developer: formData.get('developer'),
      realtorName: formData.get('realtorName'),
      canonicalUrl: formData.get('canonicalUrl'),
      ogImage: formData.get('ogImage'),
      highlights: JSON.parse((formData.get('highlights') as string) || '[]'),
      lat: formData.get('lat'),
      lng: formData.get('lng'),
      street: formData.get('street'),
      number: formData.get('number'),
      complement: formData.get('complement'),
      district: formData.get('district'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipcode: formData.get('zipcode'),
      country: formData.get('country') || 'Brasil',
      amenities: JSON.parse((formData.get('amenities') as string) || '[]'),
      images: JSON.parse((formData.get('images') as string) || '[]'),
    }

    const validated = propertySchema.parse(rawData)

    // Generate slug
    const baseSlug = slugify(validated.title)
    let slug = baseSlug
    let counter = 1
    while (await db.property.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create address with new hierarchical structure
    const address = await db.address.create({
      data: {
        street: validated.street,
        streetNumber: validated.streetNumber || validated.number || '',
        complement: validated.complement || null,
        postalCode: validated.postalCode || validated.zipcode || '',
        neighborhoodId: validated.neighborhoodId,
        lat: validated.lat,
        lng: validated.lng,
        // Campos legacy (para compatibilidade)
        district: validated.district || null,
        city: validated.city || null,
        state: validated.state || null,
        zipcode: validated.zipcode || validated.postalCode || null,
        country: validated.country || 'Brasil',
      },
    })

    // Create property
    const property = await db.property.create({
      data: {
        slug,
        title: validated.title,
        description: validated.description,
        status: validated.status,
        purpose: validated.purpose,
        price: validated.price ? new Prisma.Decimal(validated.price) : null,
        condoFee: validated.condoFee ? new Prisma.Decimal(validated.condoFee) : null,
        iptuYearly: validated.iptuYearly ? new Prisma.Decimal(validated.iptuYearly) : null,
        areaTotal: validated.areaTotal ? new Prisma.Decimal(validated.areaTotal) : null,
        areaPrivate: validated.areaPrivate ? new Prisma.Decimal(validated.areaPrivate) : null,
        bedrooms: validated.bedrooms,
        suites: validated.suites,
        bathrooms: validated.bathrooms,
        parkingSpots: validated.parkingSpots,
        floor: validated.floor,
        yearBuilt: validated.yearBuilt,
        deliveryDate: validated.deliveryDate,
        allowAirbnb: validated.allowAirbnb,
        published: validated.published,
        featured: validated.featured,
        developer: validated.developer || null,
        realtorName: validated.realtorName || 'Gabriel Alberto',
        canonicalUrl: validated.canonicalUrl || null,
        ogImage: validated.ogImage || null,
        highlights: validated.highlights,
        lat: validated.lat,
        lng: validated.lng,
        addressId: address.id,
      },
    })

    // Create images
    if (validated.images.length > 0) {
      await db.propertyImage.createMany({
        data: validated.images.map((img, index) => ({
          propertyId: property.id,
          url: img.url,
          alt: img.alt || validated.title,
          position: img.position ?? index,
        })),
      })
    }

    // Connect amenities
    if (validated.amenities.length > 0) {
      await db.propertyAmenity.createMany({
        data: validated.amenities.map((amenityId) => ({
          propertyId: property.id,
          amenityId,
        })),
      })
    }

    revalidatePath('/admin/imoveis')
    revalidatePath('/imoveis')
    revalidatePath(`/imoveis/${slug}`)

    return { success: true, id: property.id }
  } catch (error) {
    console.error('Error creating property:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Erro ao criar imóvel' }
  }
}

export async function updateProperty(id: string, formData: FormData) {
  try {
    const property = await db.property.findUnique({ where: { id } })
    if (!property) {
      return { success: false, error: 'Imóvel não encontrado' }
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      purpose: formData.get('purpose'),
      price: formData.get('price'),
      condoFee: formData.get('condoFee'),
      iptuYearly: formData.get('iptuYearly'),
      areaTotal: formData.get('areaTotal'),
      areaPrivate: formData.get('areaPrivate'),
      bedrooms: formData.get('bedrooms'),
      suites: formData.get('suites'),
      bathrooms: formData.get('bathrooms'),
      parkingSpots: formData.get('parkingSpots'),
      floor: formData.get('floor'),
      yearBuilt: formData.get('yearBuilt'),
      deliveryDate: formData.get('deliveryDate'),
      allowAirbnb: formData.get('allowAirbnb') === 'true',
      published: formData.get('published') === 'true',
      featured: formData.get('featured') === 'true',
      developer: formData.get('developer'),
      realtorName: formData.get('realtorName'),
      canonicalUrl: formData.get('canonicalUrl'),
      ogImage: formData.get('ogImage'),
      highlights: JSON.parse((formData.get('highlights') as string) || '[]'),
      lat: formData.get('lat'),
      lng: formData.get('lng'),
      street: formData.get('street'),
      streetNumber: formData.get('streetNumber'),
      complement: formData.get('complement'),
      postalCode: formData.get('postalCode'),
      stateId: formData.get('stateId'),
      cityId: formData.get('cityId'),
      neighborhoodId: formData.get('neighborhoodId'),
      regionId: formData.get('regionId'),
      // Campos legacy (para compatibilidade)
      district: formData.get('district'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipcode: formData.get('zipcode'),
      number: formData.get('number'),
      country: formData.get('country') || 'Brasil',
      amenities: JSON.parse((formData.get('amenities') as string) || '[]'),
      images: JSON.parse((formData.get('images') as string) || '[]'),
    }

    const validated = propertySchema.parse(rawData)

    // Update address with new hierarchical structure
    if (property.addressId) {
      await db.address.update({
        where: { id: property.addressId },
        data: {
          street: validated.street,
          streetNumber: validated.streetNumber || validated.number || '',
          complement: validated.complement || null,
          postalCode: validated.postalCode || validated.zipcode || '',
          neighborhoodId: validated.neighborhoodId,
          lat: validated.lat,
          lng: validated.lng,
          // Campos legacy (para compatibilidade)
          district: validated.district || null,
          city: validated.city || null,
          state: validated.state || null,
          zipcode: validated.zipcode || validated.postalCode || null,
          country: validated.country || 'Brasil',
        },
      })
    }

    // Update property
    await db.property.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        status: validated.status,
        purpose: validated.purpose,
        price: validated.price ? new Prisma.Decimal(validated.price) : null,
        condoFee: validated.condoFee ? new Prisma.Decimal(validated.condoFee) : null,
        iptuYearly: validated.iptuYearly ? new Prisma.Decimal(validated.iptuYearly) : null,
        areaTotal: validated.areaTotal ? new Prisma.Decimal(validated.areaTotal) : null,
        areaPrivate: validated.areaPrivate ? new Prisma.Decimal(validated.areaPrivate) : null,
        bedrooms: validated.bedrooms,
        suites: validated.suites,
        bathrooms: validated.bathrooms,
        parkingSpots: validated.parkingSpots,
        floor: validated.floor,
        yearBuilt: validated.yearBuilt,
        deliveryDate: validated.deliveryDate,
        allowAirbnb: validated.allowAirbnb,
        published: validated.published,
        featured: validated.featured,
        developer: validated.developer || null,
        realtorName: validated.realtorName || 'Gabriel Alberto',
        canonicalUrl: validated.canonicalUrl || null,
        ogImage: validated.ogImage || null,
        highlights: validated.highlights,
        lat: validated.lat,
        lng: validated.lng,
      },
    })

    // Update images (delete old, create new)
    await db.propertyImage.deleteMany({ where: { propertyId: id } })
    if (validated.images.length > 0) {
      await db.propertyImage.createMany({
        data: validated.images.map((img, index) => ({
          propertyId: id,
          url: img.url,
          alt: img.alt || validated.title,
          position: img.position ?? index,
        })),
      })
    }

    // Update amenities (delete old, create new)
    await db.propertyAmenity.deleteMany({ where: { propertyId: id } })
    if (validated.amenities.length > 0) {
      await db.propertyAmenity.createMany({
        data: validated.amenities.map((amenityId) => ({
          propertyId: id,
          amenityId,
        })),
      })
    }

    revalidatePath('/admin/imoveis')
    revalidatePath('/imoveis')
    revalidatePath(`/imoveis/${property.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating property:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Erro ao atualizar imóvel' }
  }
}

export async function deleteProperty(id: string) {
  try {
    await db.property.delete({ where: { id } })
    revalidatePath('/admin/imoveis')
    revalidatePath('/imoveis')
    return { success: true }
  } catch (error) {
    console.error('Error deleting property:', error)
    return { success: false, error: 'Erro ao deletar imóvel' }
  }
}


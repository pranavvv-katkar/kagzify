import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const {
      title,
      slug,
      price,
      discountPercent,
      baseStock,
      description,
      shortDescription,
      categoryId,
      availableShapes,
      minQuantity,
      isCustomizable,
      isFeatured,
      isBestseller,
      isPackaging,
      isCorporateGift,
      images, // array of { url: string, isPrimary?: boolean }
      deleteImageId,
      setPrimaryImageId,
    } = body

    // If deleting a specific image
    if (deleteImageId) {
      await prisma.productImage.delete({
        where: { id: deleteImageId },
      })
    }

    // If setting primary image
    if (setPrimaryImageId) {
      await prisma.productImage.updateMany({
        where: { productId: params.id },
        data: { isPrimary: false },
      })
      await prisma.productImage.update({
        where: { id: setPrimaryImageId },
        data: { isPrimary: true },
      })
    }

    // Update main product details
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : undefined,
        slug: slug !== undefined ? slug : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        discountPercent: discountPercent !== undefined ? parseFloat(discountPercent) : undefined,
        baseStock: baseStock !== undefined ? parseInt(baseStock, 10) : undefined,
        description: description !== undefined ? description : undefined,
        shortDescription: shortDescription !== undefined ? shortDescription : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        availableShapes: availableShapes !== undefined ? availableShapes : undefined,
        minQuantity: minQuantity !== undefined ? parseInt(minQuantity, 10) : undefined,
        isCustomizable: isCustomizable !== undefined ? Boolean(isCustomizable) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : undefined,
        isPackaging: isPackaging !== undefined ? Boolean(isPackaging) : undefined,
        isCorporateGift: isCorporateGift !== undefined ? Boolean(isCorporateGift) : undefined,
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        variants: true,
      },
    })

    // If an array of images is provided, perform complete gallery synchronization
    if (Array.isArray(images)) {
      // Find current images in database
      const existingImages = await prisma.productImage.findMany({
        where: { productId: params.id },
      })
      const incomingUrls = new Set(images.map((img) => img.url).filter(Boolean))

      // Delete images that were removed by admin
      for (const ex of existingImages) {
        if (!incomingUrls.has(ex.url)) {
          await prisma.productImage.delete({ where: { id: ex.id } })
        }
      }

      // Determine which image should be primary
      const primaryIndex = images.findIndex((img) => img.isPrimary)
      const effectivePrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0

      // Create or update incoming images
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        if (!img.url) continue
        const isThisPrimary = i === effectivePrimaryIndex

        const existing = existingImages.find((ex) => ex.url === img.url)
        if (existing) {
          await prisma.productImage.update({
            where: { id: existing.id },
            data: {
              isPrimary: isThisPrimary,
              order: i,
            },
          })
        } else {
          await prisma.productImage.create({
            data: {
              productId: params.id,
              url: img.url,
              isPrimary: isThisPrimary,
              order: i,
            },
          })
        }
      }
    }

    const refreshed = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        variants: true,
      },
    })

    return NextResponse.json({ success: true, product: refreshed })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

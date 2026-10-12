import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          images: true,
          category: true,
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
    ])

    return NextResponse.json({ products, categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const {
      title,
      slug,
      description,
      shortDescription,
      price,
      discountPercent,
      baseStock,
      categoryId,
      availableShapes,
      imageUrl,
      isFeatured,
      isBestseller,
      isPackaging,
      isCorporateGift,
    } = body

    if (!title || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Title, price, and category are required' },
        { status: 400 }
      )
    }

    const safeSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const product = await prisma.product.create({
      data: {
        title,
        slug: safeSlug,
        description: description || title,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        discountPercent: parseFloat(discountPercent || 0),
        baseStock: parseInt(baseStock || 500, 10),
        categoryId,
        availableShapes: availableShapes || 'circle,rectangle,hexagon,triangle,heart,square,diecut',
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isPackaging: Boolean(isPackaging),
        isCorporateGift: Boolean(isCorporateGift),
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  isPrimary: true,
                  order: 0,
                },
              ],
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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

    const [products, stockLogs] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          baseStock: true,
          category: { select: { name: true } },
        },
        orderBy: { baseStock: 'asc' },
      }),
      prisma.stockLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])

    return NextResponse.json({ products, stockLogs })
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

    const { productId, change, reason } = await req.json()

    if (!productId || change === undefined) {
      return NextResponse.json({ error: 'ProductId and change are required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const delta = parseInt(change, 10)
    const newStock = Math.max(0, product.baseStock + delta)

    await prisma.product.update({
      where: { id: productId },
      data: { baseStock: newStock },
    })

    const log = await prisma.stockLog.create({
      data: {
        productId,
        productTitle: product.title,
        previousStock: product.baseStock,
        change: delta,
        newStock,
        reason: reason || 'Manual Admin Inventory Adjustment',
        adminEmail: admin.email,
      },
    })

    return NextResponse.json({ success: true, newStock, log })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

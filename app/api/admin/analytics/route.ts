import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Orders and revenue calculations
    const [allOrders, allProducts, customRequestsCount] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        include: { images: true, category: true },
      }),
      prisma.customRequest.count({
        where: { status: 'PENDING' },
      }),
    ])

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0)

    const revenueToday = allOrders
      .filter((o) => new Date(o.createdAt) >= startOfToday)
      .reduce((sum, o) => sum + o.total, 0)

    const revenueWeek = allOrders
      .filter((o) => new Date(o.createdAt) >= startOfWeek)
      .reduce((sum, o) => sum + o.total, 0)

    const revenueMonth = allOrders
      .filter((o) => new Date(o.createdAt) >= startOfMonth)
      .reduce((sum, o) => sum + o.total, 0)

    // Low stock products (< 500 units)
    const lowStockAlerts = allProducts.filter((p) => p.baseStock < 500)

    // Top selling products count from items
    const productSalesMap: Record<string, { title: string; count: number; revenue: number }> = {}
    allOrders.forEach((ord) => {
      ord.items.forEach((item) => {
        const title = item.title
        if (!productSalesMap[title]) {
          productSalesMap[title] = { title, count: 0, revenue: 0 }
        }
        productSalesMap[title].count += item.quantity
        productSalesMap[title].revenue += item.subtotal
      })
    })

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return NextResponse.json({
      revenueToday,
      revenueWeek,
      revenueMonth,
      totalRevenue,
      totalOrders: allOrders.length,
      pendingCustomQuotes: customRequestsCount,
      lowStockCount: lowStockAlerts.length,
      lowStockAlerts: lowStockAlerts.map((p) => ({
        id: p.id,
        title: p.title,
        baseStock: p.baseStock,
        category: p.category.name,
      })),
      topProducts,
      recentOrders: allOrders.slice(0, 8),
    })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()

    const {
      items,
      shippingAddress,
      paymentMethod,
      notes,
      guestEmail,
      guestName,
      guestPhone,
    } = body

    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required order details or cart items' },
        { status: 400 }
      )
    }

    // Generate random distinct order number
    const orderNumber = `KGZ-${Math.floor(10000 + Math.random() * 90000)}`

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) =>
        sum + (item.unitPrice || 0) * (item.quantity > 0 ? (item.quantity >= 10 ? 1 : item.quantity) : 1),
      0
    )

    // Calculate shipping, discount & tax
    const discount = body.discountAmount || 0
    const shippingFee = subtotal > 999 ? 0 : 99
    const tax = Math.round((subtotal - discount) * 0.05)
    const total = Math.max(0, subtotal - discount + shippingFee + tax)

    // Create Order with Items & Payment
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user ? user.id : null,
        guestEmail: guestEmail || (user ? user.email : null),
        guestName: guestName || (user ? user.name : null),
        guestPhone: guestPhone || (user ? user.phone : null),
        status: 'PLACED',
        paymentStatus: 'PAID',
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            title: item.title,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice,
            shape: item.shape || null,
            artworkUrl: item.artworkUrl || null,
            croppedPreviewUrl: item.croppedPreviewUrl || null,
            material: item.material || null,
            finish: item.finish || null,
            size: item.size || null,
            customNotes: item.customNotes || null,
          })),
        },
        payments: {
          create: {
            method: paymentMethod || 'CARD',
            transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
            amount: total,
            status: 'COMPLETED',
          },
        },
      },
      include: {
        items: true,
      },
    })

    // Automatic stock reduction & stock logging per item
    for (const item of items) {
      if (item.productId) {
        try {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          })
          if (product) {
            const qtyReduced = Math.min(product.baseStock, item.quantity || 1)
            const newStock = Math.max(0, product.baseStock - qtyReduced)

            await prisma.product.update({
              where: { id: item.productId },
              data: { baseStock: newStock },
            })

            await prisma.stockLog.create({
              data: {
                productId: item.productId,
                productTitle: product.title,
                previousStock: product.baseStock,
                change: -qtyReduced,
                newStock,
                reason: `Customer Order Placed (#${orderNumber})`,
                adminEmail: 'system@kagzify.com',
              },
            })
          }
        } catch (stockErr) {
          console.error('Stock adjustment error for product:', item.productId, stockErr)
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ orders: [] })
    }

    const orders = await prisma.order.findMany({
      where: user.role === 'ADMIN' ? undefined : { userId: user.id },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

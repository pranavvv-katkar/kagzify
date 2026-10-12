import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()

    const {
      fullName,
      email,
      phone,
      productType,
      quantity,
      dimensions,
      finishPreferences,
      notes,
      artworkUrl,
    } = body

    if (!fullName || !email || !productType || !quantity) {
      return NextResponse.json(
        { error: 'Please provide full name, email, product type, and quantity.' },
        { status: 400 }
      )
    }

    const customRequest = await prisma.customRequest.create({
      data: {
        userId: user ? user.id : null,
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : '',
        productType,
        quantity: parseInt(quantity, 10) || 50,
        dimensions: dimensions || null,
        finishPreferences: finishPreferences || null,
        notes: notes || null,
        artworkUrl: artworkUrl || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Custom order request received successfully. Our packaging team will send a quote shortly!',
      customRequest,
    })
  } catch (error: any) {
    console.error('Error creating custom order request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit custom order request' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ requests: [] })
    }

    // If customer, return their requests
    const requests = await prisma.customRequest.findMany({
      where: user.role === 'ADMIN' ? undefined : { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ requests })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

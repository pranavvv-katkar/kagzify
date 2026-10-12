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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { status, quoteAmount, quoteNotes } = await req.json()

    const updated = await prisma.customRequest.update({
      where: { id: params.id },
      data: {
        status: status || undefined,
        quoteAmount: quoteAmount !== undefined ? parseFloat(quoteAmount) : undefined,
        quoteNotes: quoteNotes !== undefined ? quoteNotes : undefined,
      },
    })

    return NextResponse.json({ success: true, customRequest: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

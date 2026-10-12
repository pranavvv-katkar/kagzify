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

    const [heroSlides, faqs, testimonials] = await Promise.all([
      prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
      prisma.fAQ.findMany({ orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    return NextResponse.json({ heroSlides, faqs, testimonials })
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
    const { type, data } = body

    if (type === 'heroSlide') {
      const slide = await prisma.heroSlide.create({
        data: {
          badge: data.badge || null,
          title: data.title,
          subtitle: data.subtitle,
          ctaText: data.ctaText || 'Shop Now',
          ctaLink: data.ctaLink || '/products',
          secondaryCtaText: data.secondaryCtaText || null,
          secondaryCtaLink: data.secondaryCtaLink || null,
          imageUrl: data.imageUrl,
          order: parseInt(data.order || 0, 10),
          active: true,
        },
      })
      return NextResponse.json({ success: true, item: slide })
    } else if (type === 'faq') {
      const faq = await prisma.fAQ.create({
        data: {
          question: data.question,
          answer: data.answer,
          category: data.category || 'General',
          order: parseInt(data.order || 0, 10),
        },
      })
      return NextResponse.json({ success: true, item: faq })
    } else if (type === 'testimonial') {
      const testimonial = await prisma.testimonial.create({
        data: {
          customerName: data.customerName,
          company: data.company || null,
          role: data.role || null,
          rating: parseInt(data.rating || 5, 10),
          comment: data.comment,
          avatarUrl: data.avatarUrl || null,
          isFeatured: true,
        },
      })
      return NextResponse.json({ success: true, item: testimonial })
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

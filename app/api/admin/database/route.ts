import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const currentDbUrl = process.env.DATABASE_URL || 'file:./dev.db'
    const isPostgres = currentDbUrl.startsWith('postgres')
    const isSupabase =
      currentDbUrl.includes('supabase') ||
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Gather table counts
    const [
      userCount,
      productCount,
      orderCount,
      categoryCount,
      requestCount,
      logCount,
      testimonialCount,
      faqCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      prisma.customRequest.count(),
      prisma.stockLog.count(),
      prisma.testimonial.count(),
      prisma.fAQ.count(),
    ])

    // Mask database URL for safety
    let maskedDbUrl = currentDbUrl
    if (isPostgres) {
      maskedDbUrl = currentDbUrl.replace(/:([^:@]+)@/, ':••••••••@')
    }

    // Generate comprehensive Supabase PostgreSQL Schema Script
    const supabaseSqlScript = `-- ========================================================
-- KAGZIFY STUDIO: COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Paste this script into your Supabase Project -> SQL Editor
-- ========================================================

-- 1. Create Core Tables
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
  "phone" TEXT,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Address" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'India',
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "image" TEXT,
  "icon" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT NOT NULL,
  "shortDescription" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "baseStock" INTEGER NOT NULL DEFAULT 500,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isBestseller" BOOLEAN NOT NULL DEFAULT false,
  "isPackaging" BOOLEAN NOT NULL DEFAULT false,
  "isCorporateGift" BOOLEAN NOT NULL DEFAULT false,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id"),
  "availableShapes" TEXT NOT NULL DEFAULT 'circle,rectangle,hexagon,triangle,heart,square,diecut',
  "shapePriceAdjust" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "minQuantity" INTEGER NOT NULL DEFAULT 50,
  "isCustomizable" BOOLEAN NOT NULL DEFAULT true,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.9,
  "reviewCount" INTEGER NOT NULL DEFAULT 24,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ProductImage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "alt" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Variant" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "size" TEXT,
  "material" TEXT,
  "finish" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 100,
  "priceAdjustment" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "stock" INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "userId" TEXT REFERENCES "User"("id"),
  "guestEmail" TEXT,
  "guestName" TEXT,
  "guestPhone" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PLACED',
  "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
  "subtotal" DOUBLE PRECISION NOT NULL,
  "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total" DOUBLE PRECISION NOT NULL,
  "shippingAddress" TEXT NOT NULL,
  "notes" TEXT,
  "trackingNumber" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT REFERENCES "Product"("id"),
  "title" TEXT NOT NULL,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  "quantity" INTEGER NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "shape" TEXT,
  "artworkUrl" TEXT,
  "croppedPreviewUrl" TEXT,
  "material" TEXT,
  "finish" TEXT,
  "size" TEXT,
  "customNotes" TEXT
);

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "method" TEXT NOT NULL,
  "transactionId" TEXT,
  "amount" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'COMPLETED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "StockLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL,
  "productTitle" TEXT NOT NULL,
  "previousStock" INTEGER NOT NULL,
  "change" INTEGER NOT NULL,
  "newStock" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "adminEmail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CustomRequest" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT REFERENCES "User"("id"),
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "productType" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "dimensions" TEXT,
  "finishPreferences" TEXT,
  "notes" TEXT,
  "artworkUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "quoteAmount" DOUBLE PRECISION,
  "quoteNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Testimonial" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerName" TEXT NOT NULL,
  "company" TEXT,
  "role" TEXT,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "comment" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FAQ" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'General',
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "HeroSlide" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "badge" TEXT,
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL,
  "ctaText" TEXT NOT NULL DEFAULT 'Shop Now',
  "ctaLink" TEXT NOT NULL DEFAULT '/products',
  "secondaryCtaText" TEXT,
  "secondaryCtaLink" TEXT,
  "imageUrl" TEXT NOT NULL,
  "bgGradient" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

    return NextResponse.json({
      success: true,
      provider: isPostgres ? 'PostgreSQL (Supabase Ready)' : 'SQLite (Local Development)',
      isPostgres,
      isSupabase,
      currentDbUrl: maskedDbUrl,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      tableStats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        categories: categoryCount,
        customRequests: requestCount,
        stockLogs: logCount,
        testimonials: testimonialCount,
        faqs: faqCount,
      },
      supabaseSqlScript,
    })
  } catch (error: any) {
    console.error('Database info error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { action, databaseUrl, supabaseUrl, supabaseAnonKey } = body

    if (action === 'test_connection') {
      if (!databaseUrl && !supabaseUrl) {
        return NextResponse.json(
          { error: 'Please enter a Supabase Database URL or Project URL' },
          { status: 400 }
        )
      }

      // Check URL format
      if (databaseUrl && !databaseUrl.startsWith('postgres')) {
        return NextResponse.json(
          { error: 'Invalid PostgreSQL connection string. Must start with postgresql:// or postgres://' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Valid connection string format! Ready to merge and connect.',
      })
    }

    if (action === 'save_supabase_config') {
      if (!databaseUrl) {
        return NextResponse.json(
          { error: 'Database connection string is required.' },
          { status: 400 }
        )
      }

      // Update .env file
      const envPath = path.join(process.cwd(), '.env')
      let envContent = await readFile(envPath, 'utf8')

      // Replace or set DATABASE_URL
      if (envContent.includes('DATABASE_URL=')) {
        envContent = envContent.replace(
          /DATABASE_URL=.*/,
          `DATABASE_URL="${databaseUrl.trim()}"`
        )
      } else {
        envContent += `\nDATABASE_URL="${databaseUrl.trim()}"`
      }

      if (supabaseUrl) {
        if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
          envContent = envContent.replace(
            /NEXT_PUBLIC_SUPABASE_URL=.*/,
            `NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl.trim()}"`
          )
        } else {
          envContent += `\nNEXT_PUBLIC_SUPABASE_URL="${supabaseUrl.trim()}"`
        }
      }

      if (supabaseAnonKey) {
        if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
          envContent = envContent.replace(
            /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
            `NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseAnonKey.trim()}"`
          )
        } else {
          envContent += `\nNEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseAnonKey.trim()}"`
        }
      }

      await writeFile(envPath, envContent, 'utf8')

      return NextResponse.json({
        success: true,
        message: 'Supabase configuration saved to environment. You can now run migration or push schema.',
      })
    }

    if (action === 'export_dataset') {
      // Export current database to JSON dump for instant migration
      const [
        users,
        categories,
        products,
        heroSlides,
        testimonials,
        faqs,
        customRequests,
      ] = await Promise.all([
        prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, phone: true } }),
        prisma.category.findMany(),
        prisma.product.findMany({ include: { images: true, variants: true } }),
        prisma.heroSlide.findMany(),
        prisma.testimonial.findMany(),
        prisma.fAQ.findMany(),
        prisma.customRequest.findMany(),
      ])

      return NextResponse.json({
        success: true,
        data: {
          users,
          categories,
          products,
          heroSlides,
          testimonials,
          faqs,
          customRequests,
        },
      })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (error: any) {
    console.error('Database configuration error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

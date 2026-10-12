'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Star,
  Flame,
  ArrowRight,
  Clock,
  Layers,
  Heart,
  Eye,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface ProductPreview {
  id: string
  title: string
  slug: string
  price: number
  discountPercent: number
  rating: number
  reviewCount: number
  images: { url: string }[]
  category: { name: string }
  isCustomizable?: boolean
  availableShapes?: string
}

export default function DiscountedDeals({ products = [] }: { products?: ProductPreview[] }) {
  const { addItem } = useCart()

  // Deal countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 18 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filter discounted items or fallback
  const discounted = products.filter((p) => p.discountPercent > 0).slice(0, 4)

  if (discounted.length === 0) return null

  return (
    <section className="py-16 bg-white dark:bg-stone-900/90 border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Deal Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Limited-Time Print Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-display">
              Exclusive Volume Discounts
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Top requested custom packaging, die-cut stickers, and corporate merch at direct studio rates.
            </p>
          </div>

          {/* Deal Countdown */}
          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-4 py-2.5 rounded-2xl">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
              <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span>Flash Sale Ends:</span>
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-xs text-stone-900 dark:text-stone-100">
              <span className="bg-stone-900 dark:bg-stone-950 text-gold-300 px-2 py-1 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-stone-900 dark:bg-stone-950 text-gold-300 px-2 py-1 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-stone-900 dark:bg-stone-950 text-gold-300 px-2 py-1 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discounted.map((prod) => {
            const finalPrice = prod.price * (1 - prod.discountPercent / 100)
            const mainImg = prod.images[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'

            return (
              <div
                key={prod.id}
                className="group relative bg-stone-50/60 dark:bg-stone-950/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                    {prod.discountPercent}% OFF
                  </span>
                </div>

                {/* Image Container */}
                <Link
                  href={`/products/${prod.slug}`}
                  className="relative aspect-square w-full bg-stone-100 dark:bg-stone-800 overflow-hidden block"
                >
                  <img
                    src={mainImg}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[11px] font-semibold text-brand-800 dark:text-gold-400 uppercase tracking-wider">
                        {prod.category?.name || 'Custom Print'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prod.rating.toFixed(1)}</span>
                        <span className="text-stone-400 dark:text-stone-500 font-normal">({prod.reviewCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-2 hover:text-brand-900 dark:hover:text-gold-400 transition font-display">
                        {prod.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 line-through">
                        ₹{prod.price.toFixed(0)}
                      </div>
                      <div className="text-base font-extrabold text-stone-950 dark:text-stone-100">
                        ₹{finalPrice.toFixed(0)}
                        <span className="text-[10px] font-normal text-stone-500 dark:text-stone-400 ml-1">/ unit</span>
                      </div>
                    </div>

                    <Link
                      href={`/products/${prod.slug}`}
                      className="px-3 py-1.5 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

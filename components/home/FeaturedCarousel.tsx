'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Sparkles,
  Layers,
} from 'lucide-react'

interface ProductItem {
  id: string
  title: string
  slug: string
  price: number
  discountPercent: number
  rating: number
  reviewCount: number
  images: { url: string }[]
  category: { name: string }
}

export default function FeaturedCarousel({ products = [] }: { products?: ProductItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  if (products.length === 0) return null

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Controls */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight font-display">
              Featured Studio Creations
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition"
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition"
              aria-label="Next Products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((prod) => {
            const finalPrice = prod.price * (1 - prod.discountPercent / 100)
            const img = prod.images[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'

            return (
              <div
                key={prod.id}
                className="w-72 flex-shrink-0 bg-stone-50 rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <Link
                  href={`/products/${prod.slug}`}
                  className="aspect-square bg-stone-100 overflow-hidden block relative"
                >
                  <img
                    src={img}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                      {prod.discountPercent}% OFF
                    </span>
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-brand-800">{prod.category?.name}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prod.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <Link href={`/products/${prod.slug}`}>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1 group-hover:text-brand-900 transition font-display">
                        {prod.title}
                      </h4>
                    </Link>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400">From</span>
                      <div className="text-sm font-black text-stone-900">₹{finalPrice.toFixed(0)}</div>
                    </div>

                    <Link
                      href={`/products/${prod.slug}`}
                      className="px-3 py-1.5 rounded-xl bg-brand-900 text-gold-300 text-xs font-semibold hover:bg-brand-950 transition flex items-center gap-1"
                    >
                      <span>View</span>
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

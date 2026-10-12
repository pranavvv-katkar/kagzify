'use client'

import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  Gift,
  Coffee,
  ShoppingBag,
  Printer,
  Tag,
} from 'lucide-react'

const categories = [
  {
    title: 'Custom Stickers & Labels',
    subtitle: 'Die-cut, holographic, waterproof vinyl',
    count: '15+ Materials',
    slug: 'stickers-labels',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    icon: Sparkles,
    badge: 'Popular',
  },
  {
    title: 'Luxury Rigid Boxes',
    subtitle: 'Magnetic snap, drawer & folding cartons',
    count: 'Custom Dimensions',
    slug: 'packaging-boxes',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    icon: Package,
    badge: 'Luxury',
  },
  {
    title: 'Eco Kraft Barrier Pouches',
    subtitle: 'Food-grade resealable coffee & snack pouches',
    count: 'Airtight Zip',
    slug: 'packaging-boxes',
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=600&q=80',
    icon: Layers,
    badge: 'Eco Friendly',
  },
  {
    title: 'Custom Courier Mailers',
    subtitle: 'Waterproof LDPE & biodegradable shipping bags',
    count: 'Edge-to-Edge Print',
    slug: 'bags-mailers',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    icon: ShoppingBag,
    badge: 'D2C Essential',
  },
  {
    title: 'Corporate Welcome Swag',
    subtitle: 'Notebooks, metal pens, and welcome kits',
    count: 'Low MOQs',
    slug: 'corporate-gifting',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    icon: Gift,
    badge: 'Enterprise',
  },
  {
    title: 'Custom Tumblers & Mugs',
    subtitle: 'Vacuum insulated flasks with laser etching',
    count: '360° Rotary UV',
    slug: 'drinkware-bottles',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    icon: Coffee,
    badge: 'Laser Cut',
  },
  {
    title: 'Cotton Business Cards',
    subtitle: '600 GSM heavy cotton with foil edge gilding',
    count: 'Tactile Finishes',
    slug: 'stationery-marketing',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    icon: Printer,
    badge: 'Prestige',
  },
  {
    title: 'Personal Custom Orders',
    subtitle: 'Print unlisted sizes, prototypes, & bespoke kits',
    count: '4h Rapid Quote',
    slug: 'custom-order-link',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    icon: Tag,
    badge: 'Rapid Quote',
    isSpecial: true,
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-white dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-transparent dark:border-stone-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Explore Possibilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            What Are You Printing Today?
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            Select a product category to view technical specifications, material choices, and start configuring your run.
          </p>
        </div>

        {/* 8-Grid of categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon
            const targetHref = cat.isSpecial ? '/custom-order' : `/products?category=${cat.slug}`

            return (
              <Link
                key={idx}
                href={targetHref}
                className={`group relative rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-stone-800 overflow-hidden p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  cat.isSpecial
                    ? 'bg-gradient-to-br from-brand-950 via-brand-900 to-stone-900 text-white border-brand-800'
                    : 'bg-stone-50/70 dark:bg-stone-900 hover:bg-white dark:hover:bg-stone-850 text-stone-900 dark:text-stone-100'
                }`}
              >
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      cat.isSpecial
                        ? 'bg-gold-400 text-stone-950'
                        : 'bg-white dark:bg-stone-800 shadow-sm text-brand-900 dark:text-gold-400 border border-stone-100 dark:border-stone-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.isSpecial
                        ? 'bg-white/10 text-gold-300 border border-gold-400/30'
                        : 'bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-gold-300 border border-brand-100 dark:border-brand-800/40'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Imagery Preview */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-stone-200/60 dark:bg-stone-800">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info & Subtitle */}
                <div>
                  <h3
                    className={`text-sm sm:text-base font-bold font-display ${
                      cat.isSpecial ? 'text-white' : 'text-stone-900 dark:text-stone-100 group-hover:text-brand-900 dark:group-hover:text-gold-400'
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`text-[11px] sm:text-xs mt-1 line-clamp-1 ${
                      cat.isSpecial ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {cat.subtitle}
                  </p>
                </div>

                {/* Footer Count & Arrow */}
                <div className="mt-3 pt-2.5 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between text-[11px] font-semibold">
                  <span className={cat.isSpecial ? 'text-gold-300' : 'text-stone-500 dark:text-stone-400'}>
                    {cat.count}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 group-hover:translate-x-1 transition-transform ${
                      cat.isSpecial ? 'text-gold-300' : 'text-brand-800 dark:text-gold-400'
                    }`}
                  >
                    <span>Browse</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

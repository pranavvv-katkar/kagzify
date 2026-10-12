'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Flame,
  Package,
  Gift,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  ExternalLink,
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
  category: { name: string; slug: string }
  isBestseller?: boolean
  isPackaging?: boolean
  isCorporateGift?: boolean
  shortDescription?: string | null
}

const inspirationGallery = [
  {
    title: 'Minimalist Matte Cosmetic Jar Labels',
    category: 'Skincare & Cosmetics',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    tags: ['Waterproof', 'Circle Die-Cut', 'Matte Finish'],
  },
  {
    title: 'Hot Gold-Foil Magnetic Presentation Boxes',
    category: 'Haute Horlogerie & Jewelry',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    tags: ['1400 GSM Board', 'Foil Stamping', 'Custom Foam Insert'],
  },
  {
    title: 'Iridescent Holographic Streetwear Decals',
    category: 'Fashion & Apparel',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Prism Film', 'UV Resistant', 'Laptop Decal'],
  },
  {
    title: 'Executive Welcome Kit with Laser-Engraved Flask',
    category: 'Tech Enterprise Onboarding',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    tags: ['Rotary UV', 'Vegan Leather', 'Laser Etch'],
  },
  {
    title: 'Natural Virgin Kraft Coffee Pouches',
    category: 'Specialty Roastery',
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80',
    tags: ['Airtight Zipper', 'One-Way Valve', 'Biodegradable'],
  },
  {
    title: 'Cotton Letterpress Heavy Business Cards',
    category: 'Architecture & Design Studios',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    tags: ['600 GSM Cotton', 'Painted Edges', 'Blind Deboss'],
  },
]

export default function TabbedProductShowcase({ products = [] }: { products?: ProductItem[] }) {
  const [activeTab, setActiveTab] = useState<'bestseller' | 'packaging' | 'corporate' | 'gallery'>('bestseller')

  // Filter based on active tab
  let displayedProducts = products
  if (activeTab === 'bestseller') {
    displayedProducts = products.filter((p) => p.isBestseller).slice(0, 6)
    if (displayedProducts.length === 0) displayedProducts = products.slice(0, 6)
  } else if (activeTab === 'packaging') {
    displayedProducts = products.filter((p) => p.isPackaging || p.category?.slug === 'packaging-boxes' || p.category?.slug === 'bags-mailers').slice(0, 6)
  } else if (activeTab === 'corporate') {
    displayedProducts = products.filter((p) => p.isCorporateGift || p.category?.slug === 'corporate-gifting' || p.category?.slug === 'drinkware-bottles').slice(0, 6)
  }

  return (
    <section className="py-20 bg-paper-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Tabs Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-2 border border-transparent dark:border-brand-800/40">
              <Sparkles className="w-3.5 h-3.5 text-brand-700 dark:text-gold-400" />
              <span>Curated Showroom</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-display">
              Handpicked Studio Favorites
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-lg">
              Explore the print products modern enterprises and creative brands rely on daily.
            </p>
          </div>

          {/* Interactive Tabs Bar */}
          <div className="flex flex-wrap p-1.5 bg-stone-200/80 dark:bg-stone-900 rounded-2xl gap-1 text-xs font-semibold border border-transparent dark:border-stone-800">
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Bestsellers</span>
            </button>

            <button
              onClick={() => setActiveTab('packaging')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'packaging'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Packaging & Boxes</span>
            </button>

            <button
              onClick={() => setActiveTab('corporate')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'corporate'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Corporate Gifts</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'gallery'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspiration Gallery</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab !== 'gallery' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((prod) => {
              const discountedPrice = prod.price * (1 - prod.discountPercent / 100)
              const imgUrl = prod.images[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'

              return (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <Link
                    href={`/products/${prod.slug}`}
                    className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-stone-800 overflow-hidden block"
                  >
                    <img
                      src={imgUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.discountPercent > 0 && (
                      <span className="absolute top-4 left-4 bg-brand-900 text-gold-300 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </Link>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                        <span className="font-semibold text-brand-800 dark:text-gold-400 uppercase tracking-wider text-[11px]">
                          {prod.category?.name}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{prod.rating.toFixed(1)}</span>
                          <span className="text-stone-400 dark:text-stone-500 font-normal">({prod.reviewCount})</span>
                        </div>
                      </div>

                      <Link href={`/products/${prod.slug}`}>
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-brand-900 dark:group-hover:text-gold-400 transition font-display">
                          {prod.title}
                        </h3>
                      </Link>

                      {prod.shortDescription && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                          {prod.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-stone-400">Starting from</div>
                        <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                          ₹{discountedPrice.toFixed(0)}
                          <span className="text-xs font-normal text-stone-500 dark:text-stone-400 ml-1">/ unit</span>
                        </div>
                      </div>

                      <Link
                        href={`/products/${prod.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-gold-500 hover:bg-brand-900 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Configure</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Inspiration Gallery Tab Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationGallery.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-stone-900 aspect-square shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white font-display mb-3">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Products CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-brand-900 dark:hover:border-gold-500 text-stone-900 dark:text-stone-100 hover:text-brand-900 dark:hover:text-gold-300 font-bold text-xs sm:text-sm shadow-sm transition"
          >
            <span>View Full Catalog & Pricing Tables</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

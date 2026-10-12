'use client'

import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  Star,
  CheckCircle2,
  Gift,
} from 'lucide-react'

export default function PopularPicksBento() {
  return (
    <section className="py-20 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-transparent dark:border-emerald-800/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Signature Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
              Popular Picks & Bento Showcase
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
              Engineered for tactile prestige, viral unboxings, and brand recognition.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-900 dark:text-gold-400 hover:text-brand-950 dark:hover:text-gold-300 underline underline-offset-4"
          >
            <span>Explore All 20+ Print Formats</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Bento Item 1: Large 2-column feature for Die-Cut Stickers with Shape Showcase */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl group border border-brand-800/40">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-[11px] font-bold uppercase tracking-wider inline-block mb-3">
                ⭐ #1 Most Ordered
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                Die-Cut Vinyl Stickers with Instant Shape Masking
              </h3>
              <p className="mt-2 text-stone-300 text-xs sm:text-sm max-w-md">
                Waterproof, dishwasher-safe, and UV-resistant thick vinyl cut to circles, hexagons, hearts, or your organic brand contour.
              </p>

              {/* Interactive shape pills simulation */}
              <div className="mt-5 flex flex-wrap gap-2">
                {['Circle', 'Rectangle', 'Hexagon', 'Heart', 'Triangle', 'Die-Cut'].map((shape) => (
                  <span
                    key={shape}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-stone-200 transition"
                  >
                    {shape}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
              <div>
                <span className="text-stone-400 text-xs">Packs starting at</span>
                <div className="text-2xl font-black text-gold-300">₹169 <span className="text-xs font-normal text-stone-300">/ 50 pcs</span></div>
              </div>

              <Link
                href="/products/die-cut-vinyl-stickers"
                className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition group-hover:scale-105"
              >
                <span>Launch Customizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Item 2: Magnetic Closure Rigid Luxury Box */}
          <div className="bg-white dark:bg-stone-950 rounded-3xl p-6 border border-stone-200/90 dark:border-stone-800 flex flex-col justify-between shadow-md hover:shadow-xl transition-all group">
            <div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80"
                  alt="Magnetic Box"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:text-gold-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-transparent dark:border-brand-800/40">
                Luxury Packaging
              </span>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2 font-display">
                Magnetic Closure Rigid Boxes
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                1200 GSM heavy board with concealed magnets & metallic foil stamping.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">From ₹349</span>
              <Link
                href="/products/magnetic-closure-rigid-box"
                className="text-xs font-bold text-brand-900 dark:text-gold-400 hover:text-brand-950 dark:hover:text-gold-300 flex items-center gap-1"
              >
                <span>View Specs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Bento Item 3: Holographic Foil Stickers */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-950 dark:to-stone-900 rounded-3xl p-6 border border-amber-200/60 dark:border-stone-800 flex flex-col justify-between shadow-md hover:shadow-xl transition-all group">
            <div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-stone-800 mb-4 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="Holographic Labels"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-transparent dark:border-amber-800/40">
                Iridescent Shimmer
              </span>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2 font-display">
                Holographic Prism Decals
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                Light-refracting metallic finish that makes cosmetics and tech brands stand out.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-stone-800 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">From ₹260</span>
              <Link
                href="/products/holographic-stickers"
                className="text-xs font-bold text-amber-900 dark:text-gold-400 hover:text-amber-950 dark:hover:text-gold-300 flex items-center gap-1"
              >
                <span>Customize</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Bento Item 4: Full-width / 4-col bottom banner for Corporate Gifting */}
          <div className="md:col-span-3 lg:col-span-4 bg-paper-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center flex-shrink-0">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
                  Corporate Welcome Kits & VIP Employee Onboarding
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mt-0.5">
                  Curate custom gift boxes with laser-etched tumblers, vegan leather diaries, executive pens, and apparel. We handle multi-address direct dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/custom-order"
                className="px-5 py-2.5 rounded-xl bg-brand-900 dark:bg-gold-500 hover:bg-brand-950 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs flex items-center gap-2 transition shadow-sm"
              >
                <span>Request Corporate Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}


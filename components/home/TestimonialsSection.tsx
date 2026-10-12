'use client'

import React from 'react'
import { Star, Quote, CheckCircle2 } from 'lucide-react'

interface TestimonialItem {
  id: string
  customerName: string
  company?: string | null
  role?: string | null
  rating: number
  comment: string
  avatarUrl?: string | null
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: '1',
    customerName: 'Aarav Mehta',
    company: 'Roast & Brew Artisan Coffee',
    role: 'Founder & Head of Brand',
    rating: 5,
    comment: 'Kagzify transformed our whole customer unboxing experience. The custom matte kraft pouches and embossed stickers look like they belong in a Michelin star boutique. The 48-hour turn-around is unmatched.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    customerName: 'Sanya Sengupta',
    company: 'Lumière Skincare & Organics',
    role: 'Creative Director',
    rating: 5,
    comment: 'The live sticker customizer made designing our cosmetic jar labels effortless. Seeing the real-time hexagon mask and ordering our exact quantity without rigid high MOQs saved us weeks.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    customerName: 'Vikramaditya Roy',
    company: 'Zenith FinTech Labs',
    role: 'VP People & Culture',
    rating: 5,
    comment: 'We ordered 350 custom executive welcome boxes with engraved tumblers and vegan leather journals for our global annual summit. Every single box arrived pristine and our employees were thoroughly wowed.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
]

export default function TestimonialsSection({ testimonials = defaultTestimonials }: { testimonials?: TestimonialItem[] }) {
  const items = testimonials.length > 0 ? testimonials : defaultTestimonials

  return (
    <section className="py-20 bg-paper-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider inline-block mb-2 border border-transparent dark:border-brand-800/40">
            Client Voices
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Loved by 5,000+ Fast-Growing Brands
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            From homegrown specialty shops to multinational tech giants, see what our clients say.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200/90 dark:border-stone-800 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-brand-200 dark:text-brand-800 mb-3" />

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author profile */}
              <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                <img
                  src={item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={item.customerName}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{item.customerName}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {item.role} {item.company && `• ${item.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

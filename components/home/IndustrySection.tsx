'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Utensils,
  Shirt,
  Cpu,
  Sparkles,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const industries = [
  {
    id: 'food',
    name: 'Food & Beverage',
    icon: Utensils,
    tagline: 'Food-grade barrier pouches, tamper-evident seals & custom cup sleeves',
    description: 'Airtight packaging compliant with hygiene standards. Keep ground coffee, craft teas, bakery goods, and organic confectionery fresh.',
    items: ['Kraft Stand-Up Pouches', 'Waterproof Bottle Labels', 'Greaseproof Food Wraps', 'Takeaway Paper Bags'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'retail',
    name: 'Fashion & Retail',
    icon: Shirt,
    tagline: 'High-GSM hang tags, printed mailers & branded shopping totes',
    description: 'Leave an unmistakable tactile impression. We produce heavy cotton hang tags with metallic eyelets, branded tissue paper, and dual-strip courier bags.',
    items: ['Printed Poly Mailers', 'Luxury Gift Rigid Boxes', 'Debossed Garment Hang Tags', 'Woven Brand Labels'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tech',
    name: 'Corporate & Tech',
    icon: Cpu,
    tagline: 'Executive employee kits, laser-etched merchandise & client gifting',
    description: 'Transform new hire orientations and annual summits into celebrations. Full turnkey curation with individual doorstep drops.',
    items: ['Engraved Steel Tumblers', 'Hardbound PU Notebooks', 'Laptop Vinyl Decals', 'Custom Presentation Boxes'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics & Skincare',
    icon: Sparkles,
    tagline: 'Oil-resistant waterproof labels, dropper cartons & holographic seals',
    description: 'Formulated with ultra-durable adhesives and protective film to endure essential oils, shower steam, and constant handling.',
    items: ['Holographic Foil Labels', 'Soft-Touch Matte Dropper Boxes', 'Cosmetic Jar Decals', 'Sample Sachet Packaging'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'events',
    name: 'Events & Weddings',
    icon: Calendar,
    tagline: 'Foil-stamped invitation suites, welcome gift hampers & commemorative favors',
    description: 'Heirloom quality 600 GSM cotton stocks with hand-gilded edges and wax seal finishes for unforgettable milestones.',
    items: ['Gilded Edge Invitation Cards', 'Favor Gift Boxes', 'VIP Badge Stickers', 'Curated Return Gift Kits'],
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
]

export default function IndustrySection() {
  const [selected, setSelected] = useState(industries[0])

  return (
    <section className="py-20 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-12">
          <span className="px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Tailored Industry Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white">
            Custom Print for Every Industry
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-2">
            Every sector has unique barrier, tactile, and branding requirements. We engineer materials built for your exact operational environment.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-stone-800">
          {industries.map((ind) => {
            const Icon = ind.icon
            const isSelected = selected.id === ind.id

            return (
              <button
                key={ind.id}
                onClick={() => setSelected(ind)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gold-400 text-stone-950 shadow-lg'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{ind.name}</span>
              </button>
            )
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-stone-950/80 border border-stone-800 rounded-3xl p-6 sm:p-10 items-center">
          
          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-gold-300 uppercase tracking-widest">
                {selected.tagline}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
                {selected.name} Packaging & Print Suite
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mt-3">
                {selected.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {selected.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="px-5 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs flex items-center gap-2 transition"
              >
                <span>Browse Products for {selected.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/custom-order"
                className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-700 transition"
              >
                <span>Get a Industry Quote</span>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
            <img
              src={selected.image}
              alt={selected.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
          </div>

        </div>

      </div>
    </section>
  )
}

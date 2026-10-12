'use client'

import React from 'react'
import Link from 'next/link'
import {
  MousePointerClick,
  UploadCloud,
  Eye,
  Truck,
  ArrowRight,
} from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Select Format & Shape',
    description: 'Pick your product type—die-cut stickers, magnetic boxes, barrier pouches, or merchandise—and choose circle, hexagon, heart, or contour shapes.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Upload Artwork or Image',
    description: 'Drop your vector artwork (SVG, AI, PDF) or high-res photo (PNG, JPG). Reposition, scale, and align it effortlessly with our live visual customizer.',
    icon: UploadCloud,
  },
  {
    step: '03',
    title: 'Instant Live Mask & Proof',
    description: 'Watch your design immediately re-mask with precision cut-lines and peel shadows. See live real-time price calculation as you adjust sizes and tiers.',
    icon: Eye,
  },
  {
    step: '04',
    title: 'Precision Print & Express Delivery',
    description: 'Our presses print in vibrant high-definition CMYK. We quality-check, securely pack in protective materials, and dispatch to your doorstep within 48h.',
    icon: Truck,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-transparent dark:border-stone-800 text-xs font-bold uppercase tracking-wider inline-block mb-2">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            How Custom Printing Works
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            From design file to museum-grade packaging in your hands without complex technical hurdles.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon

            return (
              <div
                key={idx}
                className="relative bg-stone-50/70 dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/90 dark:border-stone-800 flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                {/* Step Number Top Banner */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-stone-200 dark:text-stone-800 group-hover:text-gold-400/40 transition-colors font-display">
                    {st.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2 font-display">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/50 dark:border-stone-800 flex items-center text-xs font-semibold text-brand-900 dark:text-gold-400">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/products/die-cut-vinyl-stickers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs sm:text-sm shadow-md transition"
          >
            <span>Try the Customizer Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

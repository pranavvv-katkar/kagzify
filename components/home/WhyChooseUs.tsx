'use client'

import React from 'react'
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Layers,
  HeartHandshake,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Zero Die & Setup Fees',
    description: 'Traditional printers charge thousands for metal cutting dies and plate preparation. With our computerized laser die-cutting, custom shapes cost zero extra.',
  },
  {
    icon: Sparkles,
    title: '48-Hour Rapid Dispatch',
    description: 'High-speed digital presses ensure standard orders print, finish, and ship within 48 to 72 business hours. Never miss a product launch again.',
  },
  {
    icon: Layers,
    title: 'Accessible Short Runs (Low MOQs)',
    description: 'Order from as few as 25 or 50 pieces without paying exorbitant bulk penalties. Test new branding, seasonal drops, and limited editions risk-free.',
  },
  {
    icon: ShieldCheck,
    title: 'Free File Proofing & Quality Pre-Flight',
    description: 'Our in-house prepress technicians personally verify your bleed lines, resolution, safe zones, and color spaces prior to print.',
  },
  {
    icon: Leaf,
    title: 'Eco-Certified & Recyclable Substrates',
    description: 'Biodegradable kraft papers, soy-based inks, water-based varnishes, and FSC-certified stocks that protect both your brand and the planet.',
  },
  {
    icon: HeartHandshake,
    title: '100% Quality & Repayment Guarantee',
    description: 'If your printed order differs from approved digital proofs or exhibits production defects, we reprint it immediately or refund your order.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-paper-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-2 border border-transparent dark:border-brand-800/40">
            <span>The Kagzify Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Why Modern Brands Choose Us
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            We combined high-speed digital engineering with artisanal finishing to eliminate the friction of custom print ordering.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon

            return (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/40 text-brand-900 dark:text-gold-400 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-brand-700 dark:text-gold-400" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2 font-display">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

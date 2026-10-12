'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
}

const defaultFaqs: FaqItem[] = [
  {
    id: '1',
    question: 'What file formats can I upload for custom printing and stickers?',
    answer: 'We accept vector files including SVG, AI, EPS, and PDF for optimal razor-sharp print quality, as well as high-resolution raster files (PNG, JPG, TIFF) at 300 DPI or higher. Our live customizer automatically checks file fidelity and offers instant shape clipping.',
    category: 'Artwork & Customizer',
  },
  {
    id: '2',
    question: 'What is your minimum order quantity (MOQ)?',
    answer: 'Unlike traditional industrial print houses that require thousands of units, our digital short-run printing starts as low as 10 to 50 pieces for stickers, mailers, and custom drinkware, and 25 units for rigid luxury gift boxes. Scale seamlessly as your business grows.',
    category: 'Ordering & Pricing',
  },
  {
    id: '3',
    question: 'How fast will my order be produced and delivered?',
    answer: 'Standard digital custom printing ships within 48 to 72 business hours after artwork proof approval. Luxury rigid packaging and large-volume orders typically dispatch in 5-7 business days. Express shipping is available across all pin codes.',
    category: 'Shipping & Delivery',
  },
  {
    id: '4',
    question: 'Are your vinyl stickers truly waterproof and weather-resistant?',
    answer: 'Yes! Our die-cut vinyl stickers feature premium thick vinyl film and a UV-inhibiting laminate overcoat. They resist heavy rain, intense sunlight, oil, scratch marks, and are completely dishwasher-safe.',
    category: 'Materials & Durability',
  },
  {
    id: '5',
    question: 'Can I request a sample kit or a bespoke product not listed on the catalog?',
    answer: 'Absolutely. You can use our "Custom Order & Personal Image" section or dedicated page to upload any photograph or 3D mock-up, specify dimensions and materials, and our packaging engineers will reply with a detailed price quote within 4 business hours.',
    category: 'Custom Projects',
  },
]

export default function FaqAccordion({ faqs = defaultFaqs }: { faqs?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  const items = faqs.length > 0 ? faqs : defaultFaqs

  return (
    <section className="py-20 bg-paper-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-stone-200/80 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-transparent dark:border-stone-800 text-xs font-bold uppercase tracking-wider inline-block mb-2">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            Everything you need to know about materials, turnaround times, short runs, and artwork preparation.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx

            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-stone-900 dark:text-stone-100 hover:text-brand-900 dark:hover:text-gold-400 transition"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-gold-300 border border-brand-100 dark:border-brand-800/40 hidden sm:inline-block">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold font-display">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-brand-100 dark:bg-gold-500/20 text-brand-900 dark:text-gold-400' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 animate-in fade-in duration-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div className="mt-10 p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100 font-display">
                Still have specific questions about your print project?
              </h4>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                Our print engineers are online to review your artwork files and give instant advice.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hi%20Kagzify!%20I%20have%20a%20question%20about%20custom%20printing"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 flex-shrink-0 shadow transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  )
}


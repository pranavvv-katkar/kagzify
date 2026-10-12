'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Phone, MessageCircle, Instagram } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-950 text-white text-xs py-2 px-4 border-b border-brand-900/60 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-stone-200">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-stone-300">
            Precision 48-Hour Turnaround • Zero Die-Cutting Setup Fees
          </span>
          <span className="hidden md:inline text-brand-400">|</span>
          <span className="hidden md:inline text-gold-300 font-medium">
            Use code <strong className="text-white underline decoration-gold-400">FIRST10</strong> for 10% off
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-stone-300 text-xs">
          <a
            href="https://wa.me/919876543210?text=Hi%20Kagzify!%20I%20need%20a%20custom%20printing%20quote"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp Help</span>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">@KagzifyStudio</span>
          </a>

          <Link
            href="/track"
            className="flex items-center gap-1.5 text-stone-300 hover:text-gold-300 transition-colors"
          >
            <span>🚚 Track Order</span>
          </Link>

          <Link
            href="/custom-order"
            className="text-gold-300 hover:text-gold-200 font-semibold underline underline-offset-2 ml-1"
          >
            Upload Custom Artwork &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}

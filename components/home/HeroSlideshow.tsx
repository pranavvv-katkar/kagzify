'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react'

interface Slide {
  id: string
  badge: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  imageUrl: string
  gradient: string
}

const defaultSlides: Slide[] = [
  {
    id: '1',
    badge: '✨ Bespoke Production & Zero Setup Fees',
    title: 'Custom Printing & Luxury Packaging for Modern Brands',
    subtitle: 'From pixel-perfect vinyl stickers in any shape to rigid magnetic gift boxes and employee welcome kits. Crafted with precision, shipped in 48 hours.',
    ctaText: 'Explore Collections',
    ctaLink: '/products',
    secondaryCtaText: 'Customize Stickers',
    secondaryCtaLink: '/products/die-cut-vinyl-stickers',
    imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1920&q=85',
    gradient: 'from-stone-950/95 via-stone-950/70 to-stone-950/15',
  },
  {
    id: '2',
    badge: '🏷️ Instant Real-Time Shape Masking',
    title: 'Precision Die-Cut Stickers in Any Shape You Dream',
    subtitle: 'Upload your artwork and watch it magically re-mask to circles, hexagons, hearts, or organic contours with live 3D preview and instant price calculation.',
    ctaText: 'Launch Sticker Customizer',
    ctaLink: '/products/die-cut-vinyl-stickers',
    secondaryCtaText: 'Request Custom Quote',
    secondaryCtaLink: '/custom-order',
    imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1920&q=85',
    gradient: 'from-stone-950/95 via-stone-950/70 to-stone-950/15',
  },
  {
    id: '3',
    badge: '🎁 Unforgettable Employee & Client Moments',
    title: 'Curated Corporate Gifting & Executive Merchandise',
    subtitle: 'Luxury unboxing experiences featuring engraved drinkware, embossed leather stationery, and bespoke branded kits delivered direct to doorsteps.',
    ctaText: 'Corporate Gifting Suite',
    ctaLink: '/products?category=corporate-gifting',
    secondaryCtaText: 'Upload Custom Artwork',
    secondaryCtaLink: '/custom-order',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=85',
    gradient: 'from-stone-950/95 via-stone-950/70 to-stone-950/15',
  },
]

export default function HeroSlideshow({ slides = defaultSlides }: { slides?: Slide[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  const activeSlide = slides[current]

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] bg-stone-950 overflow-hidden select-none">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-right sm:object-center brightness-105 contrast-105"
          />
          {/* Directional vignette: dark on left for text legibility, clear and vibrant on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-stone-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30 pointer-events-none" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl text-left space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-display">
            {activeSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-stone-200 leading-relaxed font-normal max-w-xl">
            {activeSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={activeSlide.ctaLink}
              className="px-6 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-gold-400/20 transition-all hover:scale-[1.02]"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {activeSlide.secondaryCtaText && activeSlide.secondaryCtaLink && (
              <Link
                href={activeSlide.secondaryCtaLink}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <span>{activeSlide.secondaryCtaText}</span>
              </Link>
            )}
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free File Proofing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>48-Hour Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Low MOQs from 25 pcs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-8 z-30 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-gold-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

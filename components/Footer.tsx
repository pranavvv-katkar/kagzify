'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Instagram,
  Linkedin,
} from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Promo Banner */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-stone-900 border border-brand-800/60 rounded-3xl p-8 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Special First-Time Customer Offer
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Get 10% Off Your First Custom Print Run
              </h3>
              <p className="mt-2 text-stone-300 text-xs sm:text-sm">
                Join 5,000+ brand owners, designers, and e-commerce leaders. Receive exclusive material sample releases, print tips, and VIP discounts.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-2xl text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>You're in! Use coupon code <strong className="text-white">FIRST10</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your corporate or brand email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white placeholder-stone-400 text-xs outline-none focus:border-gold-400 flex-1"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>Claim 10% Off</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800 text-xs">
          
          {/* Col 1: Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700 to-emerald-900 flex items-center justify-center">
                <span className="text-gold-400 font-extrabold text-lg">K</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                KAGZIFY <span className="text-gold-400 font-normal">STUDIO</span>
              </span>
            </Link>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              India's premier digital custom printing and luxury packaging studio. We empower modern D2C brands, creators, and corporate enterprises with tactile, museum-grade print experiences, zero die fees, and rapid 48-hour turnarounds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-emerald-950 flex items-center justify-center text-stone-300 hover:text-emerald-400 border border-stone-800 transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-pink-950 flex items-center justify-center text-stone-300 hover:text-pink-400 border border-stone-800 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-blue-950 flex items-center justify-center text-stone-300 hover:text-blue-400 border border-stone-800 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-display">
              Collections
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/products/die-cut-vinyl-stickers" className="hover:text-gold-300 transition">
                  Die-Cut Vinyl Stickers
                </Link>
              </li>
              <li>
                <Link href="/products/holographic-stickers" className="hover:text-gold-300 transition">
                  Holographic Foil Labels
                </Link>
              </li>
              <li>
                <Link href="/products/magnetic-closure-rigid-box" className="hover:text-gold-300 transition">
                  Magnetic Rigid Gift Boxes
                </Link>
              </li>
              <li>
                <Link href="/products/eco-kraft-stand-up-pouches" className="hover:text-gold-300 transition">
                  Kraft Stand-Up Pouches
                </Link>
              </li>
              <li>
                <Link href="/products/custom-poly-mailers" className="hover:text-gold-300 transition">
                  Printed Poly Mailers
                </Link>
              </li>
              <li>
                <Link href="/products?category=corporate-gifting" className="hover:text-gold-300 transition">
                  Corporate Welcome Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/track" className="text-gold-400 hover:text-gold-300 transition font-semibold">
                  🚚 Live Order Tracking (AWB)
                </Link>
              </li>
              <li>
                <Link href="/products/die-cut-vinyl-stickers" className="hover:text-gold-300 transition">
                  Interactive Customizer
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-gold-300 transition">
                  Upload Custom Artwork / Quote
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold-300 transition">
                  Printing Guides & Specs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-gold-300 transition text-stone-500">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase font-display">
              Studio & Help
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Plot 42, Print Innovation Hub, Phase 2, Okhla, New Delhi - 110020</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>studio@kagzify.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Kagzify Print & Packaging Studio. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-white transition">Shipping & Returns</Link>
          </div>
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Guaranteed Print Accuracy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

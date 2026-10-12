import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Leaf,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react'

export const metadata = {
  title: 'About Our Studio | Kagzify Custom Printing & Packaging',
  description: 'Learn about Kagzify Studio: precision short-run printing, luxury rigid boxes, zero setup fees, and eco-certified materials.',
}

export default function AboutPage() {
  return (
    <div className="bg-paper-50 dark:bg-stone-950 min-h-screen transition-colors">
      
      {/* Hero Banner */}
      <section className="bg-stone-950 text-white py-24 border-b border-stone-800 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="px-3.5 py-1.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-xs font-bold uppercase tracking-wider inline-block mb-4">
            Artisanal Touch • Industrial Precision
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-display text-white">
            Redefining Custom Printing & Unboxing Experiences
          </h1>
          <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
            Kagzify was founded with a singular conviction: premium, tactile packaging should not be reserved only for Fortune 500 conglomerates ordering 50,000 units.
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-brand-900 dark:text-gold-400 font-display">5,200+</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider font-semibold">Brands Powered</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-brand-900 dark:text-gold-400 font-display">14M+</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider font-semibold">Stickers & Labels Cut</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-brand-900 dark:text-gold-400 font-display">48 Hrs</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider font-semibold">Average Turnaround</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-brand-900 dark:text-gold-400 font-display">99.8%</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider font-semibold">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Studio Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-brand-800 dark:text-gold-400 uppercase tracking-wider">
              The Kagzify Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-display tracking-tight">
              Craftsmanship Engineered for the Digital Age
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
              Before Kagzify, ordering custom branded packaging meant weeks of back-and-forth emails, minimum order quantities in the thousands, and hefty tooling charges for cutting dies and printing plates.
            </p>
            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
              We eliminated those barriers. Our facility merges direct digital high-resolution presses with optical laser die-cutting systems. This enables creators to upload any artwork, see an instant masked shape proof, and order short runs from 25 pieces without compromise.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Die & Setup Charges across all standard and custom shapes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>FSC-Certified Stocks, soy inks, and biodegradable barrier pouches</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>In-house prepress specialists review every single file before pressing</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800">
            <img
              src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80"
              alt="Kagzify Print Production"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sustainable Commitment */}
      <section className="bg-brand-950 dark:bg-stone-900 text-white py-20 border-t border-brand-900 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Leaf className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-display">Our Commitment to the Planet</h2>
          <p className="text-stone-300 dark:text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed">
            Packaging should protect your brand without harming the earth. 92% of our raw paper pulp comes from responsibly managed FSC-certified forests. Our shipping mailers are made from 100% recycled polymers, and our kraft barrier pouches are certified biodegradable.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs shadow-md transition"
            >
              Explore Eco Collections
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

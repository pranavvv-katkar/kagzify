import React from 'react'
import Link from 'next/link'
import { Truck } from 'lucide-react'

export const metadata = {
  title: 'Shipping & Replacement Policy | Kagzify Studio',
  description: 'Shipping timelines, courier partners, and free reprint/replacement policy.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-sm space-y-6 text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed transition-colors">
        <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 font-display">Shipping & Replacement Policy</h1>
        <p className="text-stone-500 dark:text-stone-400 text-xs">Last updated: October 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">1. Free Express Shipping</h2>
          <p>
            We offer <strong className="text-stone-900 dark:text-stone-100">Free Express Shipping</strong> across all PIN codes in India for all orders above ₹999. Orders below ₹999 carry a flat delivery fee of ₹99.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">2. Courier Partners & Tracking</h2>
          <p>
            All packages are dispatched via premier courier services (Delhivery, BlueDart, Shiprocket, DTDC). A real-time tracking number is dispatched to your registered email and WhatsApp upon parcel pickup.
          </p>
          <div className="pt-2">
            <Link
              href="/track"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs shadow transition"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Active Shipments on Live Radar</span>
            </Link>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">3. 100% Reprint / Replacement Guarantee</h2>
          <p>
            Because all products are custom-printed with your unique brand artwork, standard returns for buyer remorse are not applicable. However, if your order arrives damaged, defective, or printed contrary to the approved digital proof, contact us within 7 days at <strong className="text-stone-900 dark:text-stone-100">support@kagzify.com</strong> and we will expedite a priority reprint or issue a full refund immediately.
          </p>
        </section>
      </div>
    </div>
  )
}

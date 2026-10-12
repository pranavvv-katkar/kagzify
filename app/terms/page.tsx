import React from 'react'

export const metadata = {
  title: 'Terms of Service | Kagzify Studio',
  description: 'Terms governing custom printing orders, artwork proofs, and production guarantees.',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-sm space-y-6 text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed transition-colors">
        <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 font-display">Terms of Service</h1>
        <p className="text-stone-500 dark:text-stone-400 text-xs">Last updated: October 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">1. Production & Pre-Flight Proofs</h2>
          <p>
            By submitting an order, customers certify that they possess the necessary rights and licenses for the artwork uploaded. We review files for print fidelity. Once production begins, changes cannot be guaranteed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">2. Color Tolerances & Screen Matching</h2>
          <p>
            Computer screens emit RGB light, whereas commercial digital presses print using CMYK pigments. While our machines are calibrated to tight delta-E tolerances, minor visual shifts between backlit phone screens and physical paper substrates may occur.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">3. Turnaround & Dispatch</h2>
          <p>
            Standard digital stickers dispatch within 48 to 72 business hours. Rigid magnetic gift boxes and large custom orders may take 5 to 7 business days as indicated on product specifications.
          </p>
        </section>
      </div>
    </div>
  )
}

import React from 'react'

export const metadata = {
  title: 'Privacy Policy | Kagzify Studio',
  description: 'How Kagzify protects your personal information, design assets, and order details.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-sm space-y-6 text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed transition-colors">
        <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 font-display">Privacy Policy</h1>
        <p className="text-stone-500 dark:text-stone-400 text-xs">Last updated: October 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">1. Information We Collect</h2>
          <p>
            When you place an order, configure stickers, request a custom quote, or upload personal images, we collect necessary contact and shipping details (name, email, phone number, shipping address) as well as the digital artwork files you transmit to our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">2. Proprietary Artwork Protection & IP</h2>
          <p>
            Your creative artwork, brand trademarks, logos, and personal images remain 100% your exclusive intellectual property. We do NOT resell, publish, or license customer artwork to third parties without express written permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">3. Payment & Security</h2>
          <p>
            All payment transactions (UPI, Credit/Debit cards, Net Banking) are encrypted using 256-bit SSL encryption. We do not store full credit card CVVs or net banking credentials on our database servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">4. Contact Us Regarding Data</h2>
          <p>
            If you wish to update your stored profile details or delete uploaded past designs, contact our privacy officer at <strong className="text-stone-900 dark:text-stone-100">privacy@kagzify.com</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}

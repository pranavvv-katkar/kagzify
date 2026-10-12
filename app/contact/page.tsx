'use client'

import React, { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Bulk Order Inquiry')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="bg-paper-50 dark:bg-stone-950 min-h-screen py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-gold-950/40 text-brand-900 dark:text-gold-400 border border-transparent dark:border-gold-800/60 text-xs font-bold uppercase tracking-wider inline-block mb-2">
            Connect With Our Team
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Contact Kagzify Studio
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            Have questions about custom dies, special substrate foil finishes, or bulk enterprise contracts? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Studio Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-950 text-white rounded-3xl p-8 space-y-6 shadow-xl border border-stone-800">
              <h2 className="text-xl font-bold font-display text-white">
                Studio Headquarters
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Visit our sample studio to touch paper weights, inspect metallic foil swatches, and review production prototypes in person.
              </p>

              <div className="space-y-4 text-xs text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Plot 42, Print Innovation Hub, Phase 2, Okhla Industrial Area, New Delhi - 110020</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>studio@kagzify.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 7:30 PM IST</span>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-4 border-t border-stone-800">
                <a
                  href="https://wa.me/919876543210?text=Hi%20Kagzify!%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-display">Message Sent Successfully!</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    A representative from our print consultation desk will get back to you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-bold transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display mb-4">
                    Send Us an Inquiry Message
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Kapoor"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs outline-none focus:border-brand-600 dark:focus:border-gold-400 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Work / Personal Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs outline-none focus:border-brand-600 dark:focus:border-gold-400 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Inquiry Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs outline-none focus:border-brand-600 dark:focus:border-gold-400 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    >
                      <option value="Bulk Order Inquiry">Bulk Order & Volume Tiers</option>
                      <option value="Material & Sample Kit Request">Free Material Sample Kit Request</option>
                      <option value="File Proofing Question">Artwork & Technical Prepress Question</option>
                      <option value="Existing Order Status">Existing Order Tracking</option>
                      <option value="Corporate Partnership">Corporate Gifting Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Project Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details on your target quantities, packaging specifications, or deadlines..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs outline-none focus:border-brand-600 dark:focus:border-gold-400 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <span>Submit Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

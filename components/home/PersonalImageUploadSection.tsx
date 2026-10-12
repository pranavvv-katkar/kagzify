'use client'

import React, { useState, useRef } from 'react'
import {
  UploadCloud,
  FileUp,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function PersonalImageUploadSection({ standalone = false }: { standalone?: boolean }) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [productType, setProductType] = useState('Custom Stickers & Decals')
  const [quantity, setQuantity] = useState('100')
  const [dimensions, setDimensions] = useState('')
  const [finishPreferences, setFinishPreferences] = useState('')
  const [notes, setNotes] = useState('')

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setErrorMsg(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setUploadedUrl(data.url)
        setFileName(file.name)
      } else {
        setErrorMsg(data.error || 'Failed to upload artwork file')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          productType,
          quantity,
          dimensions,
          finishPreferences,
          notes,
          artworkUrl: uploadedUrl,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg(true)
        // Reset form
        setNotes('')
        setDimensions('')
        setFinishPreferences('')
        setUploadedUrl(null)
        setFileName(null)
      } else {
        setErrorMsg(data.error || 'Failed to submit request')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={`py-20 ${standalone ? 'bg-paper-50 dark:bg-stone-950' : 'bg-gradient-to-b from-white to-stone-50 dark:from-stone-900 dark:to-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-300 dark:border-gold-800/40">
            <Sparkles className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400" />
            <span>Have a Bespoke Project or Unlisted Item?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Upload Any Personal Image & Request a Rapid Quote
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            Whether you want custom embossed mugs, irregular holographic decals, or bespoke rigid hampers not in our standard catalog—upload your design, specify your volume, and our packaging engineers will reply with a detailed price within 4 business hours.
          </p>
        </div>

        {/* Card Container */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
          {successMsg ? (
            <div className="p-10 sm:p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-display">
                Custom Order Inquiry Received!
              </h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto">
                Thank you, <strong>{fullName}</strong>. Our prepress and production specialists are reviewing your design and specifications. We will send a formal quote and digital 3D proof to <strong>{email}</strong> shortly.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setSuccessMsg(false)}
                  className="px-6 py-2.5 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-bold transition shadow-sm"
                >
                  Submit Another Project
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
              
              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                  1. Upload Your Personal Artwork or Photo (PNG, JPG, SVG, PDF)
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                  className="hidden"
                />

                {uploadedUrl ? (
                  <div className="relative border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {uploadedUrl.endsWith('.pdf') ? (
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">PDF File</span>
                        ) : (
                          <img src={uploadedUrl} alt="Uploaded Artwork" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>File Ready for Production</span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 truncate max-w-xs sm:max-w-md">{fileName}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedUrl(null)
                        setFileName(null)
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-700 transition"
                      title="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-brand-600 dark:hover:border-gold-500 bg-stone-50/70 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 group-hover:text-brand-900 dark:group-hover:text-gold-400 group-hover:scale-110 flex items-center justify-center transition-all">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                        {uploading ? 'Uploading your artwork...' : 'Click to browse or drag and drop your image here'}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                        High-res PNG, JPG, Vector SVG, or Print-ready PDF up to 25MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Type & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    2. Product Category / Type *
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  >
                    <option value="Custom Stickers & Decals">Custom Die-Cut Stickers & Labels</option>
                    <option value="Rigid Magnetic Luxury Boxes">Rigid Magnetic Luxury Gift Boxes</option>
                    <option value="Resealable Barrier Pouches">Resealable Kraft Barrier Pouches</option>
                    <option value="Laser-Etched Tumblers & Drinkware">Laser-Etched Stainless Drinkware & Mugs</option>
                    <option value="Corporate Swag & Welcome Onboarding Kits">Corporate Swag & Welcome Kits</option>
                    <option value="Custom Apparel & T-Shirts">Custom Apparel & Branded T-Shirts</option>
                    <option value="Eco Courier Mailers">Printed E-Commerce Courier Mailers</option>
                    <option value="Other Bespoke Print Project">Other Bespoke Print Item</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    3. Estimated Quantity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50, 100, 500 pcs"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Dimensions & Finish Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    Target Dimensions (Optional)
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 3x3 inches, 8x6x3 inch box, 500ml"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    Finish / Material Preferences
                  </label>
                  <input
                    type="text"
                    value={finishPreferences}
                    onChange={(e) => setFinishPreferences(e.target.value)}
                    placeholder="e.g. Matte finish, Gold foil stamping, Holographic"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                  Special Project Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your brand timeline, packaging requirements, packaging inserts, or any Pantone color codes."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Estimated Quote Response: <strong>Within 4 Business Hours</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition"
                >
                  <span>{submitting ? 'Submitting Quote Request...' : 'Submit Custom Order Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  )
}

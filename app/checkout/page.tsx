'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, shippingFee, taxAmount, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Form State
  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [orderNotes, setOrderNotes] = useState('')

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'COD'>('UPI')
  const [upiId, setUpiId] = useState('user@okaxis')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvv, setCardCvv] = useState('890')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) {
      setError('Your shopping cart is empty.')
      return
    }

    if (!fullName || !email || !phone || !street || !city || !state || !postalCode) {
      setError('Please fill in all required shipping address fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          discountAmount,
          shippingAddress: {
            fullName,
            phone,
            street,
            city,
            state,
            postalCode,
            country: 'India',
          },
          paymentMethod,
          notes: orderNotes,
          guestEmail: email,
          guestName: fullName,
          guestPhone: phone,
        }),
      })

      const data = await res.json()
      if (res.ok && data.orderNumber) {
        clearCart()
        router.push(`/order-success/${data.orderNumber}`)
      } else {
        setError(data.error || 'Failed to place order')
      }
    } catch (err: any) {
      setError(err.message || 'Network error processing checkout')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-display">No items to checkout</h2>
        <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
          Please add custom stickers or packaging products to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs shadow transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Checkout Header */}
      <div className="mb-8 pb-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-800 dark:text-gold-400 uppercase tracking-wider">
            Safe 256-Bit SSL Encrypted
          </span>
          <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Express Checkout
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Bank-Grade Encryption</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact, Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Contact Information */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Email Address (for proofs) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Street Address, Suite / Flat *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Flat 402, Tower B, Indiranagar"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">PIN / Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="560038"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Packaging / Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Fragile label, leave at reception..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Payment Method</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'CARD', label: 'Card', icon: CreditCard },
                { id: 'NET_BANKING', label: 'NetBanking', icon: Building },
                { id: 'COD', label: 'Bank Transfer', icon: Truck },
              ].map((m) => {
                const Icon = m.icon
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === m.id
                        ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-md font-bold'
                        : 'bg-stone-50/70 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Payment Details Simulated Form */}
            {paymentMethod === 'UPI' && (
              <div className="mt-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Instant UPI Transfer (Zero Transaction Fee)</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-[11px]">
                  Pay securely using Google Pay, PhonePe, Paytm, or BHIM. You will receive an instant payment receipt.
                </p>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs outline-none"
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="mt-3 p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NET_BANKING' && (
              <div className="mt-3 p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
                <p className="text-stone-600 dark:text-stone-300">
                  Direct connection with HDFC, ICICI, SBI, Axis, Kotak and 40+ leading Indian banks.
                </p>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="mt-3 p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
                <p className="text-stone-600 dark:text-stone-300">
                  Prepress and production begin immediately upon order confirmation. Payment verified via RTGS/NEFT invoice.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display">
              Order Items ({items.length})
            </h2>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3 text-xs">
                  <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-shrink-0">
                    <img
                      src={item.croppedPreviewUrl || item.artworkUrl || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 truncate">{item.title}</h4>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {item.quantity} pcs {item.shape && `• Shape: ${item.shape}`}
                    </p>
                    <p className="text-stone-400 dark:text-stone-500 text-[10px]">
                      {item.material} • {item.finish}
                    </p>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    ₹{(item.unitPrice * (item.quantity > 0 ? (item.quantity >= 10 ? 1 : item.quantity) : 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between text-base font-black text-stone-900 dark:text-stone-100">
                <span>Total Payable</span>
                <span className="text-brand-900 dark:text-gold-400">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-sm shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Processing Order...' : `Pay ₹${total.toFixed(2)} & Place Order`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Free File Proof Check • Full Production Tracking</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}

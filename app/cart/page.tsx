'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [inputCode, setInputCode] = useState('')
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null)

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    const res = applyCoupon(inputCode)
    setCouponFeedback(res)
    if (res.success) setInputCode('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Shopping Cart ({items.length} items)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Review your custom print runs, shape specifications, and volume tiers before checking out.
          </p>
        </div>

        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-900 dark:text-gold-400 hover:text-brand-950 dark:hover:text-gold-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-16 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-display">Your cart is empty</h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Looks like you haven't configured any custom stickers or packaging yet. Choose a product and start tailoring it to your exact brand style!
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs inline-flex items-center gap-2 shadow-md transition"
            >
              <span>Explore Products & Customizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  
                  {/* Thumbnail / Mask Preview */}
                  <div className="relative w-24 h-24 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.croppedPreviewUrl || item.artworkUrl || item.image ? (
                      <img
                        src={item.croppedPreviewUrl || item.artworkUrl || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="w-8 h-8 text-brand-700 dark:text-gold-400" />
                    )}

                    {item.shape && (
                      <span className="absolute bottom-1 right-1 text-[9px] font-bold uppercase bg-stone-900 text-gold-300 px-1.5 py-0.5 rounded shadow">
                        {item.shape}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-display">
                          {item.title}
                        </h3>
                        {item.customNotes && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 italic">
                            Note: "{item.customNotes}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Specs Badges */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.shape && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-gold-300 border border-brand-200 dark:border-brand-800 capitalize">
                          Shape: {item.shape}
                        </span>
                      )}
                      {item.size && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          Size: {item.size}
                        </span>
                      )}
                      {item.material && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {item.material}
                        </span>
                      )}
                      {item.finish && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {item.finish}
                        </span>
                      )}
                    </div>

                    {/* Quantity modifier and Line Price */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-stone-500 dark:text-stone-400">Quantity:</span>
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-stone-900 dark:text-stone-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-stone-900 dark:text-stone-100">
                          ₹{(item.unitPrice * (item.quantity > 0 ? (item.quantity >= 10 ? 1 : item.quantity) : 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 underline"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Applied: <strong>{couponCode}</strong>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (FIRST10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs uppercase tracking-wider outline-none focus:border-brand-600 dark:focus:border-gold-400 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 dark:bg-stone-800 text-white dark:text-stone-100 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-700 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] ${
                      couponFeedback.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Rows */}
              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
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
                  <span>Shipping</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 uppercase font-bold text-[10px]">
                        FREE EXPRESS
                      </span>
                    ) : (
                      `₹${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between text-base font-extrabold text-stone-900 dark:text-stone-100">
                  <span>Total Amount</span>
                  <span className="text-brand-900 dark:text-gold-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 dark:text-stone-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Die Fees • 48-Hour Turnaround • Safe 256-Bit SSL</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

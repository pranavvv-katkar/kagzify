'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
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

  if (!isCartOpen) return null

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    const res = applyCoupon(inputCode)
    setCouponFeedback(res)
    if (res.success) setInputCode('')
  }

  const freeShippingThreshold = 999
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 transition-colors">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-900 dark:text-gold-300 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display">
                Your Shopping Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-brand-50/80 dark:bg-brand-950/50 border-b border-brand-100 dark:border-brand-900/50">
            <div className="flex justify-between items-center text-xs font-semibold text-brand-900 dark:text-gold-300 mb-1.5">
              <span>
                {amountToFreeShipping > 0
                  ? `Add ₹${amountToFreeShipping} more for FREE Express Shipping!`
                  : '🎉 You have unlocked FREE Express Shipping!'}
              </span>
              <span>{shippingProgress}%</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 dark:bg-gold-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100 dark:divide-stone-800">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-stone-900 dark:text-stone-100 font-bold text-base mb-1">Your cart is empty</h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs max-w-xs mb-6">
                  Ready to print something unforgettable? Explore our custom die-cut stickers, luxury boxes, and gifting kits.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 font-semibold text-xs hover:bg-brand-950 dark:hover:bg-gold-400 transition"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  
                  {/* Thumbnail / Shape preview */}
                  <div className="relative w-20 h-20 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.croppedPreviewUrl || item.artworkUrl || item.image ? (
                      <img
                        src={item.croppedPreviewUrl || item.artworkUrl || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="w-6 h-6 text-brand-700 dark:text-gold-400" />
                    )}

                    {item.shape && (
                      <span className="absolute bottom-1 right-1 text-[9px] font-bold uppercase bg-stone-900/80 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {item.shape}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Custom Specs Pills */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.material && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                          {item.material}
                        </span>
                      )}
                      {item.finish && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                          {item.finish}
                        </span>
                      )}
                      {item.size && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                          {item.size}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        ₹{(item.unitPrice * (item.quantity > 0 ? (item.quantity >= 10 ? 1 : item.quantity) : 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/60 space-y-4">
              
              {/* Coupon Code Section */}
              <div className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Code <strong>{couponCode}</strong> applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. FIRST10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs uppercase tracking-wider outline-none focus:border-brand-600 dark:focus:border-gold-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-semibold rounded-lg transition"
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

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
                        FREE
                      </span>
                    ) : (
                      `₹${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-extrabold text-stone-900 dark:text-stone-100">
                  <span>Total Amount</span>
                  <span className="text-brand-900 dark:text-gold-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Safe & Encrypted 256-bit Checkout • Fast 48h Production</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

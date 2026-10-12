'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  productId: string
  title: string
  slug?: string
  unitPrice: number
  quantity: number
  shape?: string
  material?: string
  finish?: string
  size?: string
  artworkUrl?: string
  croppedPreviewUrl?: string
  customNotes?: string
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  discountAmount: number
  shippingFee: number
  taxAmount: number
  total: number
  itemCount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  couponCode: string
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kagzify_cart')
      const savedCoupon = localStorage.getItem('kagzify_coupon')
      if (savedCart) setItems(JSON.parse(savedCart))
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon)
        setCouponCode(parsed.code)
        setDiscountPercent(parsed.percent)
      }
    } catch (e) {
      console.error('Failed to restore cart:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Persist to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kagzify_cart', JSON.stringify(items))
      if (couponCode) {
        localStorage.setItem(
          'kagzify_coupon',
          JSON.stringify({ code: couponCode, percent: discountPercent })
        )
      } else {
        localStorage.removeItem('kagzify_coupon')
      }
    }
  }, [items, couponCode, discountPercent, isLoaded])

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    // Generate distinct ID incorporating customization specs
    const id = `${newItem.productId}-${newItem.shape || 'standard'}-${newItem.size || ''}-${newItem.material || ''}-${newItem.finish || ''}-${Date.now().toString(36)}`
    
    setItems((prev) => [...prev, { ...newItem, id }])
    setIsCartOpen(true)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
    setCouponCode('')
    setDiscountPercent(0)
  }

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase()
    if (clean === 'FIRST10' || clean === 'WELCOME10') {
      setCouponCode(clean)
      setDiscountPercent(10)
      return { success: true, message: 'Coupon applied! 10% discount on order.' }
    } else if (clean === 'LUXE20' || clean === 'BULK20') {
      setCouponCode(clean)
      setDiscountPercent(20)
      return { success: true, message: 'VIP Coupon applied! 20% discount on order.' }
    } else {
      return { success: false, message: 'Invalid or expired coupon code. Try FIRST10.' }
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setDiscountPercent(0)
  }

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * (item.quantity > 0 ? (item.quantity >= 10 ? 1 : item.quantity) : 1), 0)
  // Note: For custom printing, unitPrice is often calculated for the selected tier (e.g. 100 pcs bundle price)
  // If item.quantity is e.g. 100 stickers bundle, subtotal uses item.unitPrice directly.

  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05) // 5% GST
  const total = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount)
  const itemCount = items.length

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

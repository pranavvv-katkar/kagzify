'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  Layers,
  Package,
  Gift,
  HelpCircle,
  FileUp,
  ShieldCheck,
  LogOut,
  Truck,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  const { itemCount, setIsCartOpen } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950 flex items-center justify-center shadow-md shadow-brand-950/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-gold-400 font-extrabold text-xl tracking-tighter">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 font-display flex items-center gap-1.5">
                KAGZIFY
                <span className="text-xs px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-gold-300 font-semibold border border-brand-200 dark:border-brand-800/50 tracking-normal hidden sm:inline-block">
                  LUXE
                </span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-500 dark:text-stone-400">
                Custom Print & Packaging
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search custom stickers, rigid boxes, pouches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-stone-100/90 dark:bg-stone-900 border border-transparent dark:border-stone-800 focus:border-brand-600 dark:focus:border-gold-500 focus:bg-white dark:focus:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3.5" />
            </div>
          </form>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Custom Order Rapid Quote CTA */}
            <Link
              href="/custom-order"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 transition-all"
            >
              <FileUp className="w-3.5 h-3.5 text-brand-700 dark:text-gold-400" />
              <span>Custom Quote</span>
            </Link>

            {/* Sticker Customizer Direct Button */}
            <Link
              href="/products/die-cut-vinyl-stickers"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 shadow-sm transition-all hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400 dark:text-stone-950" />
              <span>Design Studio</span>
            </Link>

            {/* Track Order Direct Link */}
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition"
              title="Track Shipment"
            >
              <Truck className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span className="hidden xl:inline">Track</span>
            </Link>

            {/* Dark Mode Switch */}
            <ThemeToggle />

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-900 dark:text-gold-300 flex items-center justify-center font-bold text-xs border border-brand-300 dark:border-brand-700">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline text-xs font-medium text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-100 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-brand-900 dark:bg-gold-500/20 text-gold-300 dark:text-gold-400 border border-gold-500/30 rounded">
                            Administrator
                          </span>
                        )}
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-brand-900 dark:hover:text-gold-300"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        My Account & Orders
                      </Link>

                      <Link
                        href="/track"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800"
                      >
                        <Truck className="w-4 h-4 text-stone-400" />
                        Track Orders (AWB)
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false)
                          await logout()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-stone-100 dark:border-stone-800"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition"
                >
                  <User className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800 dark:text-stone-200" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-800 dark:bg-gold-500 text-gold-300 dark:text-stone-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80 py-2.5 text-xs font-medium text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="hover:text-brand-900 dark:hover:text-gold-300 transition font-semibold text-stone-900 dark:text-stone-200 flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-brand-700 dark:text-gold-400" />
              All Collections
            </Link>
            <Link
              href="/products/die-cut-vinyl-stickers"
              className="hover:text-brand-900 dark:hover:text-gold-300 transition flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              3D Studio & Stickers
            </Link>
            <Link
              href="/products?category=packaging-boxes"
              className="hover:text-brand-900 dark:hover:text-gold-300 transition flex items-center gap-1 text-stone-700 dark:text-stone-300"
            >
              <Package className="w-3.5 h-3.5 text-stone-400" />
              Rigid Boxes & Packaging
            </Link>
            <Link
              href="/products?category=corporate-gifting"
              className="hover:text-brand-900 dark:hover:text-gold-300 transition flex items-center gap-1 text-stone-700 dark:text-stone-300"
            >
              <Gift className="w-3.5 h-3.5 text-stone-400" />
              Corporate Gifting
            </Link>
            <Link
              href="/products?category=bags-mailers"
              className="hover:text-brand-900 dark:hover:text-gold-300 transition text-stone-700 dark:text-stone-300"
            >
              Bags & Mailers
            </Link>
            <Link
              href="/products?category=stationery-marketing"
              className="hover:text-brand-900 dark:hover:text-gold-300 transition text-stone-700 dark:text-stone-300"
            >
              Marketing Stationery
            </Link>
          </div>

          <div className="flex items-center gap-5 text-stone-500 dark:text-stone-400">
            <Link href="/track" className="hover:text-stone-900 dark:hover:text-gold-300 transition flex items-center gap-1 text-brand-800 dark:text-gold-300 font-semibold">
              <Truck className="w-3.5 h-3.5" />
              Live AWB Tracking
            </Link>
            <Link href="/about" className="hover:text-stone-900 dark:hover:text-stone-200 transition">
              About Studio
            </Link>
            <Link href="/blog" className="hover:text-stone-900 dark:hover:text-stone-200 transition">
              Print Guides
            </Link>
            <Link href="/contact" className="hover:text-stone-900 dark:hover:text-stone-200 transition">
              Contact Us
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </form>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 mb-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Theme Mode</span>
            <ThemeToggle showLabel={true} />
          </div>

          <div className="space-y-1 text-sm font-medium text-stone-700 dark:text-stone-300">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              All Collections
            </Link>
            <Link
              href="/products/die-cut-vinyl-stickers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-900 dark:text-gold-300 font-semibold"
            >
              ✨ 3D Studio & Sticker Customizer
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
            >
              🚚 Track Order & AWB Status
            </Link>
            <Link
              href="/products?category=packaging-boxes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Rigid Boxes & Packaging
            </Link>
            <Link
              href="/products?category=corporate-gifting"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Corporate Gifting & Merch
            </Link>
            <Link
              href="/custom-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold text-emerald-800 dark:text-emerald-400"
            >
              Upload Personal Image / Custom Quote
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Printing Guides
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Package,
  MapPin,
  Clock,
  Sparkles,
  FileText,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'orders' | 'quotes' | 'addresses' | 'profile'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchUserData()
    }
  }, [user, loading])

  const fetchUserData = async () => {
    setDataLoading(true)
    try {
      const [ordersRes, quotesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/custom-requests'),
      ])

      if (ordersRes.ok) {
        const oData = await ordersRes.json()
        setOrders(oData.orders || [])
      }

      if (quotesRes.ok) {
        const qData = await quotesRes.json()
        setQuotes(qData.requests || [])
      }
    } catch (e) {
      console.error('Failed to fetch account data:', e)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || (!user && dataLoading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-stone-500 dark:text-stone-400">
        Loading your account dashboard...
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Account Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 font-display">
                {user.name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 dark:bg-gold-950/40 text-brand-800 dark:text-gold-400 border border-brand-200 dark:border-gold-800/60">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-emerald-100 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Operator Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-3 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </div>
              <span className="text-[11px] opacity-80">{orders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'quotes'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Custom Quotes & Artwork</span>
              </div>
              <span className="text-[11px] opacity-80">{quotes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'addresses'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Delivery Addresses</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'profile'
                  ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content Body (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
                Your Print Orders ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-12 text-center space-y-3">
                  <Package className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display">No orders placed yet</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    Configure your first run of die-cut stickers or packaging boxes with live proofing.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block px-5 py-2.5 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-bold transition shadow"
                  >
                    Start Customizing
                  </Link>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm space-y-4 p-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : ord.status === 'IN_PRODUCTION'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">
                          Placed on {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/track?order=${ord.orderNumber}`}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Truck className="w-3.5 h-3.5 text-gold-500" />
                          <span>Track Live Radar</span>
                        </Link>

                        <div className="text-right">
                          <span className="text-xs text-stone-400 dark:text-stone-500 block">Total</span>
                          <strong className="text-base font-black text-brand-900 dark:text-gold-400">
                            ₹{ord.total.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-stone-100 dark:divide-stone-800">
                      {ord.items.map((item: any) => (
                        <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-shrink-0">
                              <img
                                src={item.croppedPreviewUrl || item.artworkUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80'}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-900 dark:text-stone-100">{item.title}</h4>
                              <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                                {item.quantity} units {item.shape && `• Shape: ${item.shape}`}
                              </p>
                              <p className="text-stone-400 dark:text-stone-500 text-[10px]">
                                {item.material} • {item.finish}
                              </p>
                            </div>
                          </div>
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            ₹{item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking */}
                    {ord.trackingNumber && (
                      <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Tracking AWB: <strong className="font-mono text-stone-900 dark:text-stone-100">{ord.trackingNumber}</strong></span>
                        </div>
                        <Link
                          href={`/track?awb=${ord.trackingNumber}`}
                          className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Track Courier Dispatch</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
                  Custom Quote Requests ({quotes.length})
                </h2>
                <Link
                  href="/custom-order"
                  className="px-3.5 py-1.5 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-bold transition shadow"
                >
                  + New Quote Request
                </Link>
              </div>

              {quotes.length === 0 ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-12 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display">No custom quotes submitted</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    Have an unlisted product or bespoke packaging dimensions? Upload your artwork to get a fast quote.
                  </p>
                  <Link
                    href="/custom-order"
                    className="inline-block px-5 py-2.5 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-bold transition"
                  >
                    Upload Design for Quote
                  </Link>
                </div>
              ) : (
                quotes.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {q.artworkUrl && (
                          <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-shrink-0">
                            <img src={q.artworkUrl} alt="Quote" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-display">{q.productType}</h3>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                q.status === 'QUOTED'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : q.status === 'APPROVED'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Target Quantity: <strong>{q.quantity} pcs</strong> {q.dimensions && `• Dimensions: ${q.dimensions}`}
                          </p>
                        </div>
                      </div>

                      {q.quoteAmount && (
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-semibold block">Quoted Price</span>
                          <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">
                            ₹{q.quoteAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {q.notes && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                        <strong>Customer Notes:</strong> {q.notes}
                      </p>
                    )}

                    {q.quoteNotes && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300">
                        <strong className="block text-emerald-950 dark:text-emerald-200 mb-0.5">Studio Engineer Response:</strong>
                        <span>{q.quoteNotes}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
                Saved Delivery Addresses
              </h2>

              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-800 dark:text-gold-400" />
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">Default Shipping Address</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  <p className="font-bold text-stone-900 dark:text-stone-100">{user.name}</p>
                  <p>Plot 42, Lotus Orchid, Indiranagar 100ft Road</p>
                  <p>Bengaluru, Karnataka - 560038, India</p>
                  <p className="text-stone-500 dark:text-stone-400 mt-1">Contact: {user.phone || '+91 91234 56789'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-4 max-w-lg">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
                Profile Details
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-500 dark:text-stone-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-stone-500 dark:text-stone-400 block mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-stone-500 dark:text-stone-400 block mb-1">Account Role</label>
                  <input
                    type="text"
                    disabled
                    value={user.role}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

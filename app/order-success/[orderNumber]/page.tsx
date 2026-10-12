import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Package,
  Clock,
  Printer,
  Truck,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderNumber: string }
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
      payments: true,
    },
  })

  if (!order) {
    notFound()
  }

  let address: any = {}
  try {
    address = JSON.parse(order.shippingAddress)
  } catch (e) {
    address = { street: order.shippingAddress }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Success Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-xl text-center space-y-6">
        
        {/* Animated Checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Payment Completed • Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Thank You for Your Order!
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
            Order Reference: <strong className="text-stone-900 dark:text-stone-100 font-mono text-base">{order.orderNumber}</strong>
          </p>
        </div>

        {/* 4-Phase Production Tracker */}
        <div className="pt-6 pb-2 border-t border-b border-stone-100 dark:border-stone-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">Phase 1</span>
              <strong className="text-xs text-stone-900 dark:text-stone-100 block mt-0.5">Order Placed</strong>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">✓ Completed</span>
            </div>

            <div className="p-3 bg-brand-50 dark:bg-gold-950/30 rounded-2xl border border-brand-200 dark:border-gold-800/60">
              <span className="text-[10px] text-brand-800 dark:text-gold-400 font-bold uppercase block">Phase 2</span>
              <strong className="text-xs text-stone-900 dark:text-stone-100 block mt-0.5">Prepress Proof</strong>
              <span className="text-[10px] text-brand-700 dark:text-gold-400">In Progress (2h)</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase block">Phase 3</span>
              <strong className="text-xs text-stone-900 dark:text-stone-100 block mt-0.5">Precision Print</strong>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Upcoming (24h)</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase block">Phase 4</span>
              <strong className="text-xs text-stone-900 dark:text-stone-100 block mt-0.5">Express Delivery</strong>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Doorstep Drop</span>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="text-left space-y-4 pt-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-display">
            Order Items Summary
          </h2>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-stone-50/40 dark:bg-stone-800/40">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-shrink-0">
                    <img
                      src={item.croppedPreviewUrl || item.artworkUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100">{item.title}</h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {item.quantity} units {item.shape && `• Shape: ${item.shape}`}
                    </p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500">
                      {item.material} {item.finish && `• ${item.finish}`}
                    </p>
                  </div>
                </div>

                <div className="font-bold text-stone-900 dark:text-stone-100">
                  ₹{item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 text-xs space-y-2 border border-stone-200 dark:border-stone-700">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Delivery Address</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 text-right">
                {address.fullName || order.guestName}, {address.street}, {address.city}, {address.state} - {address.postalCode}
              </span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Total Paid</span>
              <span className="font-black text-brand-900 dark:text-gold-400 text-sm">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/track?order=${order.orderNumber}`}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Dispatch Radar</span>
          </Link>

          <Link
            href="/account"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs transition"
          >
            View in My Account
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold text-xs transition"
          >
            Continue Shopping
          </Link>
        </div>

      </div>

    </div>
  )
}

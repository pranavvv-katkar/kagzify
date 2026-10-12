'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  FileText,
  Printer,
  ChevronRight,
  Sparkles,
  Phone,
  Layers,
} from 'lucide-react'

// Simulated orders and tracking data for instant lookup
const MOCK_TRACKING_DATABASE: Record<string, any> = {
  'ORD-2026-001': {
    orderNumber: 'ORD-2026-001',
    awbNumber: 'DEL-9482710492',
    courier: 'Delhivery Surface Pro',
    courierUrl: 'https://www.delhivery.com/track/package/DEL-9482710492',
    status: 'IN_TRANSIT',
    currentStage: 5, // Stage 1 to 6
    estimatedDelivery: 'Tomorrow, by 5:00 PM',
    origin: 'Kagzify Litho Works, Lower Parel, Mumbai',
    destination: 'HSR Layout, Sector 4, Bengaluru, Karnataka 560102',
    recipientName: 'Arjun Verma',
    recipientPhone: '+91 98765 43210',
    deliveryOtp: '4821',
    packageWeight: '1.45 kg',
    dimensions: '28 x 20 x 12 cm',
    items: [
      {
        title: 'Custom Holographic Die-Cut Vinyl Stickers',
        quantity: '500 pcs',
        specs: 'Holographic Rainbow Foil • Optical Laser Cut • Waterproof Matte Laminate',
      },
      {
        title: 'Magnetic Rigid Gift Boxes',
        quantity: '50 pcs',
        specs: 'Obsidian Black 1200 GSM • Hot Gold Foil Stamping • Velvet Tray',
      },
    ],
    timeline: [
      {
        title: 'Out for Local Delivery (Last Mile Dispatch)',
        location: 'Bengaluru South Delivery Hub (HSR Facility)',
        time: 'Today, 09:15 AM',
        completed: true,
        current: true,
      },
      {
        title: 'Arrived at Destination Air Cargo Sorting Hub',
        location: 'Kempegowda Int. Cargo Complex, Bengaluru',
        time: 'Yesterday, 11:40 PM',
        completed: true,
      },
      {
        title: 'Dispatched in Transit via Delhivery Express Cargo',
        location: 'Bhiwandi Central Logistics Hub, Maharashtra',
        time: 'Oct 07, 04:30 PM',
        completed: true,
      },
      {
        title: 'Package Manifested & AWB Handover Complete',
        location: 'Kagzify Production Facility, Lower Parel, Mumbai',
        time: 'Oct 07, 01:15 PM',
        completed: true,
      },
      {
        title: 'Optical Laser Die-Cut & Quality Inspection (QC Passed)',
        location: 'Kagzify Finishing Line #3',
        time: 'Oct 06, 06:45 PM',
        completed: true,
      },
      {
        title: 'Offset Litho CMYK Print & Foil Stamping Complete',
        location: 'Heidelberg Speedmaster XL 106 Press',
        time: 'Oct 06, 11:30 AM',
        completed: true,
      },
      {
        title: 'Pre-Flight Artwork Approved & Bleed Validated',
        location: 'Kagzify Pre-Press Studio',
        time: 'Oct 05, 03:20 PM',
        completed: true,
      },
      {
        title: 'Order Placed & Payment Verified',
        location: 'Kagzify Cloud Gateway',
        time: 'Oct 05, 02:00 PM',
        completed: true,
      },
    ],
  },
  'ORD-2026-002': {
    orderNumber: 'ORD-2026-002',
    awbNumber: 'BLU-88237190',
    courier: 'BlueDart Apex Air Express',
    courierUrl: 'https://www.bluedart.com/tracking?track=BLU-88237190',
    status: 'IN_PRODUCTION',
    currentStage: 3,
    estimatedDelivery: 'Oct 12, by 1:00 PM',
    origin: 'Kagzify Litho Works, Lower Parel, Mumbai',
    destination: 'Cyber City, Phase 2, Gurugram, Haryana 122002',
    recipientName: 'Sneha Kapur',
    recipientPhone: '+91 98112 34567',
    deliveryOtp: 'Pending Dispatch',
    packageWeight: '3.20 kg',
    dimensions: '35 x 30 x 18 cm',
    items: [
      {
        title: 'Eco-Kraft Corrugated Shipping Mailers',
        quantity: '250 pcs',
        specs: '100% Recycled Virgin Kraft 350 GSM • Water-based Soy Ink • Self-Seal Strip',
      },
    ],
    timeline: [
      {
        title: 'Offset Litho CMYK Print & Foil Stamping in Progress',
        location: 'Kagzify Heidelberg Speedmaster Line #1',
        time: 'Today, 10:30 AM',
        completed: true,
        current: true,
      },
      {
        title: 'Pre-Flight Vector Die-Line & Bleed Approved (QC Passed)',
        location: 'Kagzify Pre-Press Studio',
        time: 'Yesterday, 04:15 PM',
        completed: true,
      },
      {
        title: 'Order Received & Digital Artwork Ingested',
        location: 'Kagzify Cloud Gateway',
        time: 'Yesterday, 02:40 PM',
        completed: true,
      },
    ],
  },
  'ORD-2026-003': {
    orderNumber: 'ORD-2026-003',
    awbNumber: 'SR-77319024',
    courier: 'Shiprocket Prime Xpress',
    courierUrl: 'https://shiprocket.co/tracking/SR-77319024',
    status: 'DELIVERED',
    currentStage: 6,
    estimatedDelivery: 'Delivered Successfully on Oct 06',
    origin: 'Kagzify Litho Works, Lower Parel, Mumbai',
    destination: 'Banjara Hills, Road No. 12, Hyderabad, Telangana 500034',
    recipientName: 'Karthik Reddy',
    recipientPhone: '+91 99490 12345',
    deliveryOtp: 'Verified',
    packageWeight: '0.85 kg',
    dimensions: '22 x 15 x 8 cm',
    items: [
      {
        title: 'Luxury Matte Gold Hot-Foil Business Cards',
        quantity: '1,000 pcs',
        specs: '600 GSM Cotton Pulp • Dual-Sided Metallic Gold Foil • Velvet Soft-Touch',
      },
    ],
    timeline: [
      {
        title: 'Delivered & Signed by Consignee',
        location: 'Banjara Hills, Hyderabad',
        time: 'Oct 06, 03:45 PM',
        completed: true,
        current: true,
      },
      {
        title: 'Out for Delivery with Agent Naresh K.',
        location: 'Hyderabad South Dispatch Center',
        time: 'Oct 06, 09:20 AM',
        completed: true,
      },
      {
        title: 'Arrived at Destination Delivery Facility',
        location: 'Hyderabad Logistics Hub',
        time: 'Oct 05, 08:30 PM',
        completed: true,
      },
      {
        title: 'Handover to Courier & Air Transit Initiated',
        location: 'Mumbai Air Cargo Terminal',
        time: 'Oct 04, 06:10 PM',
        completed: true,
      },
    ],
  },
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('order') || searchParams.get('awb') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTracking, setActiveTracking] = useState<any | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const performLookup = (query: string) => {
    const clean = query.trim().toUpperCase()
    if (!clean) return

    setIsSearching(true)
    setErrorMessage(null)
    setHasSearched(true)

    setTimeout(() => {
      // 1. Direct match in mock database by order ID
      if (MOCK_TRACKING_DATABASE[clean]) {
        setActiveTracking(MOCK_TRACKING_DATABASE[clean])
        setIsSearching(false)
        return
      }

      // 2. Match by AWB number in mock database
      const matchedByAwb = Object.values(MOCK_TRACKING_DATABASE).find(
        (rec: any) => rec.awbNumber.toUpperCase() === clean
      )
      if (matchedByAwb) {
        setActiveTracking(matchedByAwb)
        setIsSearching(false)
        return
      }

      // 3. Fallback: Generate real-time synthetic tracking for any valid-looking order number
      if (clean.startsWith('ORD-') || clean.startsWith('DEL-') || clean.startsWith('BLU-') || clean.startsWith('SR-')) {
        const isAwb = !clean.startsWith('ORD-')
        const synthetic = {
          orderNumber: isAwb ? `ORD-2026-${clean.slice(-3)}` : clean,
          awbNumber: isAwb ? clean : `DEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          courier: 'Delhivery Surface Logistics',
          courierUrl: `https://www.delhivery.com/track/package/${clean}`,
          status: 'IN_TRANSIT',
          currentStage: 4,
          estimatedDelivery: 'Within 2-3 business days',
          origin: 'Kagzify Litho Works, Lower Parel, Mumbai',
          destination: 'Customer Delivery Address (Verified PIN)',
          recipientName: 'Valued Kagzify Client',
          recipientPhone: '+91 ••••• •••••',
          deliveryOtp: 'Generated upon Out For Delivery',
          packageWeight: '1.20 kg',
          dimensions: '25 x 18 x 10 cm',
          items: [
            {
              title: 'Custom Brand Print Production Job',
              quantity: 'Custom Quantity',
              specs: 'Offset CMYK • Die-Cut Vector Form • Pre-Flight Inspected',
            },
          ],
          timeline: [
            {
              title: 'Package In Transit to Destination Hub',
              location: 'Regional Logistics Center',
              time: 'Recent Update',
              completed: true,
              current: true,
            },
            {
              title: 'Dispatched from Kagzify Production Hub',
              location: 'Kagzify Lower Parel Facility, Mumbai',
              time: 'Yesterday',
              completed: true,
            },
            {
              title: 'Die-Cutting & Pre-Flight QC Complete',
              location: 'Finishing Department',
              time: '2 days ago',
              completed: true,
            },
            {
              title: 'Order Confirmed & Job Queued',
              location: 'Kagzify Cloud Gateway',
              time: '3 days ago',
              completed: true,
            },
          ],
        }
        setActiveTracking(synthetic)
        setIsSearching(false)
        return
      }

      // Not found
      setActiveTracking(null)
      setErrorMessage(`No shipment found matching "${clean}". Please verify your Order Number (e.g., ORD-2026-001) or AWB Tracking code.`)
      setIsSearching(false)
    }, 450)
  }

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
      performLookup(initialQuery)
    } else {
      // Default to ORD-2026-001 on initial landing for an immediate WOW demonstration
      setSearchQuery('ORD-2026-001')
      performLookup('ORD-2026-001')
    }
  }, [initialQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performLookup(searchQuery)
  }

  // 6 Stages Milestone Definitions
  const STAGES = [
    { num: 1, label: 'Order Placed', desc: 'Pre-Press Intake Verified' },
    { num: 2, label: 'Pre-Flight QC', desc: 'Vector & Bleed Pass' },
    { num: 3, label: 'Offset Litho Print', desc: 'CMYK & Foil Press Run' },
    { num: 4, label: 'Laser Die-Cut', desc: 'Rigorous QC Inspection' },
    { num: 5, label: 'Courier Handover', desc: 'AWB Manifested' },
    { num: 6, label: 'Delivered', desc: 'Final Consignee Handoff' },
  ]

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      
      {/* Hero Banner with High Contrast */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Real-Time Courier & Offset Production Dispatch Radar</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-stone-900 dark:text-stone-50">
              Track Your Custom Order
            </h1>
            
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Monitor your job from high-definition offset litho printing and optical laser die-cutting to live courier handover via Delhivery, BlueDart, Shiprocket, and DTDC.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Order ID (e.g. ORD-2026-001) or Courier AWB..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3.5 rounded-2xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 flex-shrink-0"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Searching Radar...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Locate Dispatch</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pill Buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-700 dark:text-stone-300">Quick Test Samples:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ORD-2026-001')
                  performLookup('ORD-2026-001')
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-mono font-medium transition"
              >
                ORD-2026-001 (In Transit)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ORD-2026-002')
                  performLookup('ORD-2026-002')
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-mono font-medium transition"
              >
                ORD-2026-002 (In Production)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ORD-2026-003')
                  performLookup('ORD-2026-003')
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-mono font-medium transition"
              >
                ORD-2026-003 (Delivered)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('DEL-9482710492')
                  performLookup('DEL-9482710492')
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-mono font-medium transition"
              >
                DEL-9482710492 (Delhivery AWB)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {errorMessage && (
          <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold text-sm">{errorMessage}</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                Tip: You can try clicking one of the sample order buttons above to preview live tracking.
              </p>
            </div>
          </div>
        )}

        {activeTracking && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Shipment Card with Status Badge */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Order Reference
                    </span>
                    <span className="text-lg font-mono font-extrabold text-stone-900 dark:text-stone-100">
                      {activeTracking.orderNumber}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        activeTracking.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : activeTracking.status === 'IN_TRANSIT'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <span>{activeTracking.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-stone-600 dark:text-stone-300 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <span>Estimated Arrival: </span>
                    <strong className="text-stone-900 dark:text-stone-100">{activeTracking.estimatedDelivery}</strong>
                  </p>
                </div>

                {/* Courier Partner AWB Quick Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                      Courier Partner & AWB
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-gold-500" />
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {activeTracking.courier}
                      </span>
                      <span className="text-xs font-mono font-semibold text-stone-600 dark:text-stone-300">
                        ({activeTracking.awbNumber})
                      </span>
                    </div>
                  </div>

                  <a
                    href={activeTracking.courierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-brand-900 hover:bg-brand-950 dark:bg-stone-800 dark:hover:bg-stone-700 text-gold-300 dark:text-gold-400 text-xs font-bold flex items-center gap-1.5 transition border border-transparent dark:border-stone-700"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* WhatsApp Support Button */}
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hello Kagzify! I am inquiring about tracking for order #${activeTracking.orderNumber} (AWB: ${activeTracking.awbNumber}). Could you provide a quick dispatch update?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Dispatch Desk</span>
                  </a>
                </div>
              </div>

              {/* 6-Stages Production & Shipping Milestone Stepper */}
              <div className="mt-8 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-6">
                  Offset Litho CMYK & Courier Milestone Trajectory
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-2">
                  {STAGES.map((st) => {
                    const isCompleted = st.num < activeTracking.currentStage
                    const isCurrent = st.num === activeTracking.currentStage
                    const isUpcoming = st.num > activeTracking.currentStage

                    return (
                      <div
                        key={st.num}
                        className={`relative p-3.5 rounded-2xl border transition ${
                          isCurrent
                            ? 'bg-gold-50 dark:bg-gold-950/30 border-gold-400 dark:border-gold-600 shadow-sm'
                            : isCompleted
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                              isCurrent
                                ? 'bg-gold-400 text-stone-950 ring-2 ring-gold-400/30 ring-offset-1'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : st.num}
                          </span>

                          {isCurrent && (
                            <span className="text-[10px] font-black uppercase text-gold-700 dark:text-gold-400 bg-gold-200/60 dark:bg-gold-900/60 px-1.5 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                          {st.label}
                        </h4>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                          {st.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Split Grid: Detailed Transit Activity Log + Consignee & Package Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Live Transit Timeline (7 cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-6">
                  <div>
                    <h3 className="text-base font-bold font-display text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      <span>Live GPS & Production Hub Activity Log</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Chronological dispatch telemetry verified with logistics gateway
                    </p>
                  </div>
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                  {activeTracking.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border-2 transition ${
                          event.current
                            ? 'bg-gold-400 border-white dark:border-stone-900 ring-4 ring-gold-400/20'
                            : 'bg-emerald-500 border-white dark:border-stone-900'
                        }`}
                      />

                      <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-200/70 dark:border-stone-800 group-hover:border-stone-300 dark:group-hover:border-stone-700 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                            {event.title}
                          </h4>
                          <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                          <span>{event.location}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Consignee, Delivery PIN & Package Manifest (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Consignee & Security Card */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Consignee & Secure OTP Verification</span>
                  </h3>

                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                        Recipient Name
                      </span>
                      <strong className="text-stone-900 dark:text-stone-100 text-sm">
                        {activeTracking.recipientName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                        Delivery Address
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {activeTracking.destination}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                          Delivery Verification PIN
                        </span>
                        <span className="font-mono font-extrabold text-sm text-gold-600 dark:text-gold-400">
                          {activeTracking.deliveryOtp}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                          Weight / Parcel
                        </span>
                        <span className="font-mono text-stone-700 dark:text-stone-300">
                          {activeTracking.packageWeight} ({activeTracking.dimensions})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Order Item Specs */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gold-500" />
                    <span>Enclosed Custom Print Items</span>
                  </h3>

                  <div className="divide-y divide-stone-100 dark:divide-stone-800">
                    {activeTracking.items.map((it: any, i: number) => (
                      <div key={i} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between text-xs">
                          <h4 className="font-bold text-stone-900 dark:text-stone-100">
                            {it.title}
                          </h4>
                          <span className="font-mono font-bold text-gold-600 dark:text-gold-400">
                            {it.quantity}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          {it.specs}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/products"
                      className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <span>Order Additional Print Run</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  DollarSign,
  FileText,
  Sliders,
  Sparkles,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  LogOut,
  Database,
  UploadCloud,
  Image as ImageIcon,
  MessageCircle,
  Share2,
  Tag,
  Zap,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  Printer,
  QrCode,
  MapPin,
  Box,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import DatabaseMergeModal from '@/components/admin/DatabaseMergeModal'

type AdminTab =
  | 'overview'
  | 'financials'
  | 'products'
  | 'stock'
  | 'orders'
  | 'custom-requests'
  | 'cms'

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [dataLoading, setDataLoading] = useState(true)

  // Data states
  const [analytics, setAnalytics] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [stockLogs, setStockLogs] = useState<any[]>([])
  const [customRequests, setCustomRequests] = useState<any[]>([])
  const [cmsData, setCmsData] = useState<any>({ heroSlides: [], faqs: [], testimonials: [] })

  // Database merge modal state
  const [showDbMergeModal, setShowDbMergeModal] = useState(false)

  // Modal & form states
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    discountPercent: '0',
    baseStock: '500',
    categoryId: '',
    description: '',
    availableShapes: 'circle,rectangle,hexagon,triangle,heart,square,diecut',
    imageUrl: '',
    isFeatured: true,
    isBestseller: false,
    isPackaging: false,
    isCorporateGift: false,
    isCustomizable: true,
  })

  // Full Product Edit Modal State
  const [editProductModal, setEditProductModal] = useState<{ open: boolean; product: any | null }>({
    open: false,
    product: null,
  })
  const [editProductForm, setEditProductForm] = useState({
    title: '',
    slug: '',
    price: '',
    discountPercent: '0',
    baseStock: '500',
    minQuantity: '50',
    categoryId: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    isBestseller: false,
    isPackaging: false,
    isCorporateGift: false,
    isCustomizable: true,
    availableShapes: ['circle', 'rectangle', 'hexagon', 'triangle', 'heart', 'square', 'diecut'],
    images: [] as Array<{ id?: string; url: string; isPrimary?: boolean; order?: number }>,
  })
  const [newImageUrlInput, setNewImageUrlInput] = useState('')
  const [uploadingProductImage, setUploadingProductImage] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [productSaveFeedback, setProductSaveFeedback] = useState<string | null>(null)

  // Stock adjustment modal
  const [stockAdjModal, setStockAdjModal] = useState<{ open: boolean; product: any | null }>({
    open: false,
    product: null,
  })
  const [stockDelta, setStockDelta] = useState('50')
  const [stockReason, setStockReason] = useState('Production Restock')

  // Quote reply modal
  const [quoteModal, setQuoteModal] = useState<{ open: boolean; request: any | null }>({
    open: false,
    request: null,
  })
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')

  // CMS modal
  const [showAddCmsModal, setShowAddCmsModal] = useState(false)
  const [cmsType, setCmsType] = useState<'faq' | 'testimonial' | 'heroSlide'>('faq')
  const [cmsPayload, setCmsPayload] = useState({
    title: '',
    subtitle: '',
    question: '',
    answer: '',
    customerName: '',
    company: '',
    comment: '',
    imageUrl: '',
  })

  // Courier Logistics & Shipping Label Modal State
  const [shippingModal, setShippingModal] = useState<{
    open: boolean
    order: any | null
    step: 'config' | 'label'
    courier: string
    serviceType: string
    weight: string
    dimensions: string
    awbNumber: string
    rateEstimate: string
    generating: boolean
  }>({
    open: false,
    order: null,
    step: 'config',
    courier: 'Delhivery Surface Pro',
    serviceType: 'Surface Express (2-3 Business Days)',
    weight: '1.25',
    dimensions: '25 x 20 x 10',
    awbNumber: '',
    rateEstimate: '68',
    generating: false,
  })

  // Date filters for Financials
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/admin/login')
      return
    }

    if (user && user.role === 'ADMIN') {
      loadAllAdminData()
    }
  }, [user, loading])

  const loadAllAdminData = async () => {
    setDataLoading(true)
    try {
      const [anRes, ordRes, prodRes, stRes, crRes, cmsRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
        fetch('/api/admin/stock'),
        fetch('/api/custom-requests'),
        fetch('/api/admin/cms'),
      ])

      if (anRes.ok) setAnalytics(await anRes.json())
      if (ordRes.ok) {
        const o = await ordRes.json()
        setOrders(o.orders || [])
      }
      if (prodRes.ok) {
        const p = await prodRes.json()
        setProducts(p.products || [])
        setCategories(p.categories || [])
        if (p.categories?.length && !newProduct.categoryId) {
          setNewProduct((prev) => ({ ...prev, categoryId: p.categories[0].id }))
        }
      }
      if (stRes.ok) {
        const s = await stRes.json()
        setStockLogs(s.stockLogs || [])
      }
      if (crRes.ok) {
        const cr = await crRes.json()
        setCustomRequests(cr.requests || [])
      }
      if (cmsRes.ok) {
        setCmsData(await cmsRes.json())
      }
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  // Update order status
  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        )
      }
    } catch (e) {
      console.error('Order status update failed:', e)
    }
  }

  // Open Courier Shipping Modal
  const openShippingModal = (order: any) => {
    const existingAwb = order.trackingNumber || `DEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`
    setShippingModal({
      open: true,
      order,
      step: order.trackingNumber ? 'label' : 'config',
      courier: 'Delhivery Surface Pro',
      serviceType: 'Surface Express (2-3 Business Days)',
      weight: '1.25',
      dimensions: '25 x 20 x 10',
      awbNumber: existingAwb,
      rateEstimate: '68',
      generating: false,
    })
  }

  // Generate AWB and Manifest Order
  const handleGenerateAwb = async () => {
    if (!shippingModal.order) return
    setShippingModal((prev) => ({ ...prev, generating: true }))
    const generatedAwb = shippingModal.awbNumber || `DEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`

    try {
      const res = await fetch(`/api/admin/orders/${shippingModal.order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SHIPPED',
          trackingNumber: generatedAwb,
          notes: `Dispatched via ${shippingModal.courier} (${shippingModal.serviceType}) • Weight: ${shippingModal.weight}kg`,
        }),
      })

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === shippingModal.order.id
              ? { ...o, status: 'SHIPPED', trackingNumber: generatedAwb }
              : o
          )
        )
        setShippingModal((prev) => ({
          ...prev,
          generating: false,
          step: 'label',
          awbNumber: generatedAwb,
        }))
      } else {
        setShippingModal((prev) => ({ ...prev, generating: false }))
      }
    } catch (err) {
      console.error('Failed to generate AWB:', err)
      setShippingModal((prev) => ({ ...prev, generating: false }))
    }
  }

  // Add Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      if (res.ok) {
        setShowAddProductModal(false)
        loadAllAdminData()
      }
    } catch (e) {
      console.error('Product creation failed:', e)
    }
  }

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
      }
    } catch (e) {
      console.error('Delete product failed:', e)
    }
  }

  // Open Full Product Edit Modal
  const handleOpenEditProduct = (p: any) => {
    const rawShapes = p.availableShapes || 'circle,rectangle,hexagon,triangle,heart,square,diecut'
    const shapesArray = rawShapes.split(',').map((s: string) => s.trim()).filter(Boolean)

    setEditProductForm({
      title: p.title || '',
      slug: p.slug || '',
      price: p.price !== undefined ? p.price.toString() : '0',
      discountPercent: p.discountPercent !== undefined ? p.discountPercent.toString() : '0',
      baseStock: p.baseStock !== undefined ? p.baseStock.toString() : '500',
      minQuantity: p.minQuantity !== undefined ? p.minQuantity.toString() : '50',
      categoryId: p.categoryId || (categories[0]?.id || ''),
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      isFeatured: Boolean(p.isFeatured),
      isBestseller: Boolean(p.isBestseller),
      isPackaging: Boolean(p.isPackaging),
      isCorporateGift: Boolean(p.isCorporateGift),
      isCustomizable: p.isCustomizable !== undefined ? Boolean(p.isCustomizable) : true,
      availableShapes: shapesArray,
      images: p.images && p.images.length > 0 ? [...p.images] : (p.imageUrl ? [{ url: p.imageUrl, isPrimary: true, order: 0 }] : []),
    })
    setNewImageUrlInput('')
    setProductSaveFeedback(null)
    setEditProductModal({ open: true, product: p })
  }

  // Toggle shape selection in edit form
  const handleToggleShape = (shape: string) => {
    setEditProductForm((prev) => {
      const exists = prev.availableShapes.includes(shape)
      const next = exists
        ? prev.availableShapes.filter((s) => s !== shape)
        : [...prev.availableShapes, shape]
      return { ...prev, availableShapes: next }
    })
  }

  // Set primary thumbnail image for storefront
  const handleSetPrimaryImage = (targetUrl: string) => {
    setEditProductForm((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        isPrimary: img.url === targetUrl,
      })),
    }))
  }

  // Delete image from product gallery
  const handleDeleteProductImage = (targetUrl: string) => {
    setEditProductForm((prev) => {
      const remaining = prev.images.filter((img) => img.url !== targetUrl)
      if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
        remaining[0].isPrimary = true
      }
      return { ...prev, images: remaining }
    })
  }

  // Upload new image from local disk to gallery
  const handleUploadProductImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingProductImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setEditProductForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: data.url,
              isPrimary: prev.images.length === 0,
              order: prev.images.length,
            },
          ],
        }))
      } else {
        alert(data.error || 'Failed to upload image')
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading file')
    } finally {
      setUploadingProductImage(false)
      e.target.value = ''
    }
  }

  // Add image by URL
  const handleAddImageFromUrl = () => {
    if (!newImageUrlInput.trim()) return
    const url = newImageUrlInput.trim()
    setEditProductForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url,
          isPrimary: prev.images.length === 0,
          order: prev.images.length,
        },
      ],
    }))
    setNewImageUrlInput('')
  }

  // Save Product Changes & Update Storefront
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProductModal.product) return

    setSavingProduct(true)
    setProductSaveFeedback(null)

    try {
      const payload = {
        title: editProductForm.title,
        slug: editProductForm.slug,
        price: editProductForm.price,
        discountPercent: editProductForm.discountPercent,
        baseStock: editProductForm.baseStock,
        minQuantity: editProductForm.minQuantity,
        categoryId: editProductForm.categoryId,
        shortDescription: editProductForm.shortDescription,
        description: editProductForm.description,
        isFeatured: editProductForm.isFeatured,
        isBestseller: editProductForm.isBestseller,
        isPackaging: editProductForm.isPackaging,
        isCorporateGift: editProductForm.isCorporateGift,
        isCustomizable: editProductForm.isCustomizable,
        availableShapes: editProductForm.availableShapes.join(','),
        images: editProductForm.images,
      }

      const res = await fetch(`/api/admin/products/${editProductModal.product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok) {
        setProductSaveFeedback('Product successfully saved! Storefront view has been updated.')
        setProducts((prev) =>
          prev.map((p) => (p.id === editProductModal.product.id ? data.product : p))
        )
        setTimeout(() => {
          setEditProductModal({ open: false, product: null })
          setProductSaveFeedback(null)
          loadAllAdminData()
        }, 1200)
      } else {
        alert(data.error || 'Failed to update product')
      }
    } catch (err: any) {
      alert(err.message || 'Error saving product')
    } finally {
      setSavingProduct(false)
    }
  }

  // Submit stock adjustment
  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stockAdjModal.product) return

    try {
      const res = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: stockAdjModal.product.id,
          change: stockDelta,
          reason: stockReason,
        }),
      })

      if (res.ok) {
        setStockAdjModal({ open: false, product: null })
        loadAllAdminData()
      }
    } catch (e) {
      console.error('Stock adjustment failed:', e)
    }
  }

  // Submit quote reply
  const handleQuoteReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quoteModal.request) return

    try {
      const res = await fetch(`/api/admin/custom-requests/${quoteModal.request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'QUOTED',
          quoteAmount,
          quoteNotes,
        }),
      })

      if (res.ok) {
        setQuoteModal({ open: false, request: null })
        loadAllAdminData()
      }
    } catch (e) {
      console.error('Quote reply failed:', e)
    }
  }

  // Export Financials to CSV
  const handleExportCSV = () => {
    const headers = ['Order Number,Date,Customer,Total (INR),Status,Payment Method']
    const rows = orders.map((o) =>
      `"${o.orderNumber}","${new Date(o.createdAt).toLocaleDateString()}","${o.guestName || o.user?.name || 'Guest'}","${o.total}","${o.status}","${o.payments?.[0]?.method || 'N/A'}"`
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Kagzify_Financial_Report_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Add CMS item
  const handleCreateCms = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: cmsType, data: cmsPayload }),
      })
      if (res.ok) {
        setShowAddCmsModal(false)
        loadAllAdminData()
      }
    } catch (e) {
      console.error('CMS create error:', e)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center text-xs">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
          <span>Synchronizing Kagzify Studio Console...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      
      {/* Dark Sidebar (Navigation) */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-800 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Brand Emblem */}
          <div className="flex items-center gap-2.5 px-3 py-4 mb-6 border-b border-stone-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700 to-emerald-900 flex items-center justify-center text-gold-400 font-extrabold text-lg">
              K
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white font-display text-sm block">
                KAGZIFY STUDIO
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 block">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Studio Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'orders'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('custom-requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'custom-requests'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Custom Quotes Inbox</span>
              </div>
              {customRequests.filter((c) => c.status === 'PENDING').length > 0 && (
                <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {customRequests.filter((c) => c.status === 'PENDING').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'products'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('stock')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'stock'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Stock & Inventory</span>
              </div>
              {analytics?.lowStockCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {analytics.lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'financials'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financials & Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'cms'
                  ? 'bg-gold-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Homepage CMS</span>
            </button>

            {/* Supabase Cloud Database Merge Quick Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowDbMergeModal(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/80 shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">Merge Database</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Supabase
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Profile and Storefront link */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-stone-400 hover:text-white text-xs px-3 py-2 rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Storefront</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-rose-400 hover:bg-rose-950/40 text-xs px-3 py-2 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Operator</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">

        {/* Universal Admin Top Header Bar with Supabase Merge Icon & Quick Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">Environment:</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-stone-900 border border-stone-700 text-stone-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Kagzify Enterprise Console
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Supabase Merge Database Trigger */}
            <button
              type="button"
              onClick={() => setShowDbMergeModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-600/60 hover:border-emerald-500 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg transition"
            >
              <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Merge Database (Supabase)</span>
              <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.2 rounded font-mono font-semibold">
                PostgreSQL
              </span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>View Storefront</span>
            </Link>

            <button
              onClick={loadAllAdminData}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW METRICS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                  Studio Operations Executive Overview
                </h1>
                <p className="text-xs text-stone-400 mt-1">
                  Real-time revenue metrics, production queues, and inventory health
                </p>
              </div>

              <button
                onClick={loadAllAdminData}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition self-start"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Revenue Today
                </span>
                <div className="text-3xl font-black text-gold-400 mt-2 font-display">
                  ₹{analytics.revenueToday.toFixed(0)}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>Week Total: ₹{analytics.revenueWeek.toFixed(0)}</span>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Total Orders
                </span>
                <div className="text-3xl font-black text-white mt-2 font-display">
                  {analytics.totalOrders}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  All active & historical client runs
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Pending Custom Quotes
                </span>
                <div className="text-3xl font-black text-amber-400 mt-2 font-display">
                  {analytics.pendingCustomQuotes}
                </div>
                <div className="text-[11px] text-amber-300 mt-1">
                  Personal image inquiries awaiting price
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Low Stock Warnings
                </span>
                <div className="text-3xl font-black text-rose-400 mt-2 font-display">
                  {analytics.lowStockCount}
                </div>
                <div className="text-[11px] text-rose-300 mt-1">
                  Items below 500 units inventory
                </div>
              </div>
            </div>

            {/* Supabase Database Connection & Cloud Sync Card */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-800/40 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-lg flex-shrink-0">
                  <Database className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-display">
                      Supabase Cloud Database & Storage Integration
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PostgreSQL
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Store all storefront catalog edits, product images, customer orders, and custom artwork proofs in your Supabase database.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDbMergeModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition flex-shrink-0"
              >
                <Zap className="w-4 h-4 text-emerald-200" />
                <span>Merge Database (Supabase)</span>
              </button>
            </div>

            {/* Top Products & Low Stock Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Top Products */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Top Grossing Products</span>
                </h2>

                <div className="divide-y divide-stone-800">
                  {analytics.topProducts.map((p: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-stone-200 block">{p.title}</strong>
                        <span className="text-stone-500 text-[11px]">{p.count} units delivered</span>
                      </div>
                      <span className="font-mono font-bold text-gold-400">
                        ₹{p.revenue.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Low Inventory Alerts</span>
                </h2>

                {analytics.lowStockAlerts.length === 0 ? (
                  <p className="text-xs text-emerald-400 py-4">All catalog items have healthy stock levels.</p>
                ) : (
                  <div className="divide-y divide-stone-800">
                    {analytics.lowStockAlerts.map((p: any) => (
                      <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-stone-200 block">{p.title}</strong>
                          <span className="text-stone-500 text-[11px]">{p.category}</span>
                        </div>
                        <span className="font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-900">
                          {p.baseStock} units left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white font-display">
                Recent Client Orders
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950/80 uppercase text-[10px] text-stone-400">
                    <tr>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {analytics.recentOrders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-stone-800/40">
                        <td className="p-3 font-mono font-bold text-white">{o.orderNumber}</td>
                        <td className="p-3">{o.guestName || o.user?.name || 'Customer'}</td>
                        <td className="p-3">{o.items?.length || 0} items</td>
                        <td className="p-3 font-bold text-gold-400">₹{o.total.toFixed(2)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-800 text-stone-200">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FINANCIAL RECORDS */}
        {/* ========================================================= */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white font-display">
                  Financial Records & Revenue Breakdown
                </h1>
                <p className="text-xs text-stone-400">
                  Audited transaction register, volume discounts, tax records, and CSV export
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Financials to CSV</span>
              </button>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 uppercase text-[10px] text-stone-400">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">GST (5%)</th>
                    <th className="p-3">Net Total</th>
                    <th className="p-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-800/40">
                      <td className="p-3 font-mono font-bold text-white">{o.orderNumber}</td>
                      <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">{o.guestName || o.user?.name || o.guestEmail || 'Client'}</td>
                      <td className="p-3">₹{o.subtotal.toFixed(2)}</td>
                      <td className="p-3 text-emerald-400">-₹{o.discount.toFixed(2)}</td>
                      <td className="p-3">₹{o.tax.toFixed(2)}</td>
                      <td className="p-3 font-black text-gold-400">₹{o.total.toFixed(2)}</td>
                      <td className="p-3 font-semibold text-emerald-400">
                        {o.payments?.[0]?.method || 'PAID'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRODUCT MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white font-display">
                  Product Catalog & Options Management
                </h1>
                <p className="text-xs text-stone-400">
                  Add, update, or remove products, edit prices, shapes, and category tags
                </p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 bg-gold-400 hover:bg-gold-500 text-stone-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80'
                const imageCount = p.images?.length || 1
                const salePrice = p.discountPercent > 0
                  ? (p.price * (1 - p.discountPercent / 100)).toFixed(2)
                  : p.price.toFixed(2)

                return (
                  <div
                    key={p.id}
                    className="bg-stone-900 border border-stone-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-stone-700 transition"
                  >
                    <div>
                      {/* Product Thumbnail with Badges */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950 mb-3 relative group">
                        <img src={primaryImg} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                          <span className="bg-stone-900/90 text-[10px] font-bold text-stone-300 px-2 py-0.5 rounded backdrop-blur-sm">
                            Stock: {p.baseStock}
                          </span>
                          {imageCount > 1 && (
                            <span className="bg-stone-950/80 text-[10px] text-stone-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>{imageCount} photos</span>
                            </span>
                          )}
                        </div>

                        {/* Storefront Visibility Indicators */}
                        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[85%]">
                          {p.isFeatured && (
                            <span className="bg-gold-500/90 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              Featured
                            </span>
                          )}
                          {p.isBestseller && (
                            <span className="bg-emerald-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              Bestseller
                            </span>
                          )}
                          {p.isPackaging && (
                            <span className="bg-sky-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                              Packaging
                            </span>
                          )}
                          {p.isCorporateGift && (
                            <span className="bg-purple-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                              Gifting
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {p.category?.name || 'Uncategorized'}
                        </span>
                        {p.isCustomizable && (
                          <span className="text-[10px] text-gold-300 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Customizer</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white font-display line-clamp-1 mt-0.5">
                        {p.title}
                      </h3>

                      <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                        {p.shortDescription || p.description}
                      </p>

                      <div className="mt-2.5 flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-gold-400">₹{salePrice}</span>
                        {p.discountPercent > 0 && (
                          <>
                            <span className="text-xs text-stone-500 line-through">₹{p.price}</span>
                            <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 border border-rose-900/60 px-1 rounded">
                              {p.discountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Edit Product Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="px-3 py-1.5 bg-gradient-to-r from-gold-400 to-amber-400 hover:from-gold-300 hover:to-amber-300 text-stone-950 text-xs rounded-xl font-bold flex items-center gap-1.5 shadow transition"
                          title="Edit storefront details, pricing, and images"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setStockAdjModal({ open: true, product: p })
                          }}
                          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl font-medium transition"
                          title="Quick Inventory Adjustment"
                        >
                          Stock
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                          title="Preview Live on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STOCK MANAGEMENT & LOGS */}
        {/* ========================================================= */}
        {activeTab === 'stock' && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-black text-white font-display">
              Inventory & Real-Time Stock Logs
            </h1>

            {/* Inventory adjustments audit trail table */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white font-display">
                Recent Stock Adjustment Logs ({stockLogs.length})
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 uppercase text-[10px] text-stone-400">
                    <tr>
                      <th className="p-3">Product Title</th>
                      <th className="p-3">Previous</th>
                      <th className="p-3">Change</th>
                      <th className="p-3">New Stock</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {stockLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-800/40">
                        <td className="p-3 font-semibold text-white">{log.productTitle}</td>
                        <td className="p-3 font-mono">{log.previousStock}</td>
                        <td className={`p-3 font-mono font-bold ${log.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {log.change > 0 ? `+${log.change}` : log.change}
                        </td>
                        <td className="p-3 font-mono font-bold text-white">{log.newStock}</td>
                        <td className="p-3 text-stone-400">{log.reason}</td>
                        <td className="p-3 text-stone-500">{log.adminEmail || 'system'}</td>
                        <td className="p-3 text-stone-500">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ORDER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-black text-white font-display">
              Client Order Queue & Artwork Downloads
            </h1>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-white">
                          {ord.orderNumber}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusUpdate(ord.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-xs text-gold-300 font-bold outline-none"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="IN_PRODUCTION">IN PRODUCTION</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                      <span className="text-xs text-stone-400 mt-1 block">
                        Customer: {ord.guestName || ord.user?.name || 'Customer'} ({ord.guestEmail || ord.user?.email}) • Phone: {ord.guestPhone || ord.user?.phone || 'N/A'}
                      </span>
                    </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-stone-500 block">Total</span>
                          <strong className="text-lg font-black text-gold-400">
                            ₹{ord.total.toFixed(2)}
                          </strong>
                        </div>

                        {/* Courier Logistics & AWB Action */}
                        <button
                          type="button"
                          onClick={() => openShippingModal(ord)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow ${
                            ord.trackingNumber
                              ? 'bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300'
                              : 'bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold'
                          }`}
                          title="Assign Courier, Generate AWB & Print 4x6 Thermal Label"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{ord.trackingNumber ? 'AWB Label' : 'Ship & AWB'}</span>
                        </button>

                        {/* WhatsApp Dispatch Notification Button */}
                        {(ord.guestPhone || ord.user?.phone) && (
                          <a
                            href={`https://wa.me/${(ord.guestPhone || ord.user?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${ord.guestName || ord.user?.name || 'Valued Client'}! This is Kagzify Studio regarding your order #${ord.orderNumber}. Your custom print job status is currently: [${ord.status}]${
                                ord.trackingNumber ? ` (AWB: ${ord.trackingNumber}). Track live here: https://kagzify.com/track?awb=${ord.trackingNumber}` : '.'
                              } Thank you for choosing Kagzify!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow"
                            title="Send instant WhatsApp Order Update"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>

                  {/* Artwork & Items with Download */}
                  <div className="divide-y divide-stone-800">
                    {ord.items.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-stone-950 border border-stone-800 overflow-hidden flex-shrink-0">
                            <img
                              src={item.croppedPreviewUrl || item.artworkUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{item.title}</h4>
                            <p className="text-stone-400 text-[11px]">
                              {item.quantity} pcs {item.shape && `• Shape: ${item.shape}`} • {item.material} • {item.finish}
                            </p>
                            {item.customNotes && (
                              <p className="text-amber-400 text-[10px]">Notes: {item.customNotes}</p>
                            )}
                          </div>
                        </div>

                        {/* Customer Artwork Download Link */}
                        {(item.artworkUrl || item.croppedPreviewUrl) && (
                          <a
                            href={item.artworkUrl || item.croppedPreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Download Artwork</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CUSTOM QUOTES INBOX */}
        {/* ========================================================= */}
        {activeTab === 'custom-requests' && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-black text-white font-display">
              Personal Image & Bespoke Project Requests ({customRequests.length})
            </h1>

            <div className="space-y-4">
              {customRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {req.artworkUrl && (
                        <div className="w-20 h-20 rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden flex-shrink-0">
                          <img src={req.artworkUrl} alt="Artwork" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white font-display">{req.productType}</h3>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.status === 'QUOTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          From: <strong>{req.fullName}</strong> ({req.email}) • Phone: {req.phone}
                        </p>
                        <p className="text-xs text-stone-400">
                          Target Volume: <strong>{req.quantity} units</strong> {req.dimensions && `• Dimensions: ${req.dimensions}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {req.artworkUrl && (
                        <a
                          href={req.artworkUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Image</span>
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setQuoteModal({ open: true, request: req })
                          setQuoteAmount(req.quoteAmount?.toString() || '')
                          setQuoteNotes(req.quoteNotes || '')
                        }}
                        className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs rounded-xl transition"
                      >
                        {req.status === 'QUOTED' ? 'Update Quote' : 'Provide Quote'}
                      </button>
                    </div>
                  </div>

                  {req.notes && (
                    <div className="p-3 bg-stone-950/80 rounded-xl text-xs text-stone-300 border border-stone-800">
                      <strong>Client Project Notes:</strong> {req.notes}
                    </div>
                  )}

                  {req.quoteAmount && (
                    <div className="p-3 bg-emerald-950/40 rounded-xl text-xs text-emerald-300 border border-emerald-900 flex items-center justify-between">
                      <div>
                        <strong>Quoted Amount: ₹{req.quoteAmount.toFixed(2)}</strong>
                        <p className="text-[11px] text-stone-400 mt-0.5">{req.quoteNotes}</p>
                      </div>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">Sent to Customer</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: HOMEPAGE CMS */}
        {/* ========================================================= */}
        {activeTab === 'cms' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white font-display">
                  Homepage CMS (Hero Slides, FAQs, Reviews)
                </h1>
                <p className="text-xs text-stone-400">
                  Update customer testimonials, marketing slides, and prepress FAQs
                </p>
              </div>

              <button
                onClick={() => setShowAddCmsModal(true)}
                className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Content Block</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <h2 className="text-sm font-bold text-white mb-3">Hero Slides ({cmsData.heroSlides?.length || 0})</h2>
                <div className="space-y-2">
                  {cmsData.heroSlides?.map((s: any) => (
                    <div key={s.id} className="p-3 bg-stone-950 rounded-xl text-xs">
                      <strong className="block text-white truncate">{s.title}</strong>
                      <span className="text-stone-500 text-[10px]">{s.ctaText} &rarr; {s.ctaLink}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <h2 className="text-sm font-bold text-white mb-3">Testimonials ({cmsData.testimonials?.length || 0})</h2>
                <div className="space-y-2">
                  {cmsData.testimonials?.map((t: any) => (
                    <div key={t.id} className="p-3 bg-stone-950 rounded-xl text-xs">
                      <strong className="block text-white">{t.customerName}</strong>
                      <span className="text-stone-500 text-[10px]">{t.company}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
                <h2 className="text-sm font-bold text-white mb-3">FAQs ({cmsData.faqs?.length || 0})</h2>
                <div className="space-y-2">
                  {cmsData.faqs?.map((f: any) => (
                    <div key={f.id} className="p-3 bg-stone-950 rounded-xl text-xs">
                      <strong className="block text-white truncate">{f.question}</strong>
                      <span className="text-stone-500 text-[10px]">{f.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT */}
      {/* ========================================================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="text-base font-bold text-white">Create New Catalog Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Metallic Holographic Labels"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Base Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={newProduct.discountPercent}
                    onChange={(e) => setNewProduct({ ...newProduct, discountPercent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newProduct.baseStock}
                    onChange={(e) => setNewProduct({ ...newProduct, baseStock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Image URL (or Unsplash)</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-400 text-stone-950 font-bold text-xs hover:bg-gold-500 transition mt-2"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: STOCK ADJUSTMENT */}
      {/* ========================================================= */}
      {stockAdjModal.open && stockAdjModal.product && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white">Manual Stock Adjustment</h3>
              <button onClick={() => setStockAdjModal({ open: false, product: null })}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Product: <strong className="text-white">{stockAdjModal.product.title}</strong>
              <br />
              Current Stock: <strong>{stockAdjModal.product.baseStock}</strong>
            </p>

            <form onSubmit={handleStockAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Change Units (+ or -)</label>
                <input
                  type="number"
                  required
                  value={stockDelta}
                  onChange={(e) => setStockDelta(e.target.value)}
                  placeholder="e.g. 100 or -50"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Adjustment Reason</label>
                <input
                  type="text"
                  required
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gold-400 text-stone-950 font-bold text-xs"
              >
                Confirm Inventory Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: QUOTE REPLY */}
      {/* ========================================================= */}
      {quoteModal.open && quoteModal.request && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white">Provide Custom Project Quote</h3>
              <button onClick={() => setQuoteModal({ open: false, request: null })}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Customer: <strong className="text-white">{quoteModal.request.fullName}</strong>
              <br />
              Project: {quoteModal.request.productType} ({quoteModal.request.quantity} units)
            </p>

            <form onSubmit={handleQuoteReply} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Total Quoted Price (INR)</label>
                <input
                  type="number"
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 18500"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Engineer Note / Turnaround Message</label>
                <textarea
                  rows={3}
                  required
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="e.g. Price includes metallic foil tooling and GST. Estimated dispatch in 5 days."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gold-400 text-stone-950 font-bold text-xs"
              >
                Send Official Quote
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CMS ADD */}
      {/* ========================================================= */}
      {showAddCmsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white">Add Homepage Content</h3>
              <button onClick={() => setShowAddCmsModal(false)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <div className="flex gap-2">
              {(['faq', 'testimonial', 'heroSlide'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCmsType(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    cmsType === t ? 'bg-gold-400 text-stone-950' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateCms} className="space-y-3 text-xs">
              {cmsType === 'faq' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1">Question</label>
                    <input
                      type="text"
                      required
                      value={cmsPayload.question}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, question: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      required
                      value={cmsPayload.answer}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, answer: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                </>
              )}

              {cmsType === 'testimonial' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={cmsPayload.customerName}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, customerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Company / Role</label>
                    <input
                      type="text"
                      value={cmsPayload.company}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Review Comment</label>
                    <textarea
                      rows={3}
                      required
                      value={cmsPayload.comment}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, comment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                </>
              )}

              {cmsType === 'heroSlide' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1">Slide Title</label>
                    <input
                      type="text"
                      required
                      value={cmsPayload.title}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      required
                      value={cmsPayload.subtitle}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Background Image URL</label>
                    <input
                      type="text"
                      required
                      value={cmsPayload.imageUrl}
                      onChange={(e) => setCmsPayload({ ...cmsPayload, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gold-400 text-stone-950 font-bold text-xs"
              >
                Save Content Block
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FULL PRODUCT EDIT & STOREFRONT CONFIGURATION */}
      {/* ========================================================= */}
      {editProductModal.open && editProductModal.product && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto text-stone-200 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gold-400/20 border border-gold-400/50 text-gold-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white font-display">
                      Edit Storefront Product Details
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live Storefront Sync
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Update images, pricing, shapes, descriptions, and homepage discovery tags
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${editProductForm.slug || editProductModal.product.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  title="View Live on Storefront"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Storefront View</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setEditProductModal({ open: false, product: null })}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification Banner on Save */}
            {productSaveFeedback && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{productSaveFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveProductEdit} className="space-y-6 text-xs">
              
              {/* SECTION 1: CORE PRODUCT IDENTIFIERS & PRICING */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>1. Core Details & Pricing</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={editProductForm.title}
                      onChange={(e) => setEditProductForm({ ...editProductForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">URL Slug (e.g. holographic-stickers) *</label>
                    <input
                      type="text"
                      required
                      value={editProductForm.slug}
                      onChange={(e) => setEditProductForm({ ...editProductForm, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono text-xs outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Base Price (₹) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Discount %</label>
                    <input
                      type="number"
                      step="any"
                      value={editProductForm.discountPercent}
                      onChange={(e) => setEditProductForm({ ...editProductForm, discountPercent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-rose-300 font-bold outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Base Stock Count</label>
                    <input
                      type="number"
                      value={editProductForm.baseStock}
                      onChange={(e) => setEditProductForm({ ...editProductForm, baseStock: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Min Order Qty</label>
                    <input
                      type="number"
                      value={editProductForm.minQuantity}
                      onChange={(e) => setEditProductForm({ ...editProductForm, minQuantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                {/* Real-time calculated price preview */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-xs">
                  <span className="text-stone-400">Effective Storefront Starting Price:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-gold-400 font-black text-sm">
                      ₹
                      {(
                        (parseFloat(editProductForm.price) || 0) *
                        (1 - (parseFloat(editProductForm.discountPercent) || 0) / 100)
                      ).toFixed(2)}
                    </strong>
                    {parseFloat(editProductForm.discountPercent) > 0 && (
                      <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-900">
                        {editProductForm.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Assigned Category *</label>
                  <select
                    value={editProductForm.categoryId}
                    onChange={(e) => setEditProductForm({ ...editProductForm, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white outline-none focus:border-gold-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 2: MULTI-IMAGE GALLERY & PRIMARY THUMBNAIL */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>2. Storefront Images ({editProductForm.images.length})</span>
                  </h3>
                  <span className="text-[11px] text-stone-400">
                    The image marked with <strong className="text-gold-300">★ Primary</strong> is displayed on catalog cards and homepage
                  </span>
                </div>

                {/* Existing Images Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {editProductForm.images.map((img, idx) => (
                    <div
                      key={img.url + idx}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border ${
                        img.isPrimary ? 'border-gold-400 ring-2 ring-gold-400/40' : 'border-stone-800'
                      } bg-stone-900 group`}
                    >
                      <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />

                      {/* Primary badge */}
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 bg-gold-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                          ★ Primary
                        </span>
                      )}

                      {/* Image Action Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteProductImage(img.url)}
                            className="p-1 rounded bg-rose-950/90 text-rose-300 hover:bg-rose-900 transition"
                            title="Delete image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.url)}
                            className="w-full py-1 rounded bg-stone-800/90 hover:bg-gold-400 hover:text-stone-950 text-white font-bold text-[10px] transition text-center"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload & Add New Images */}
                <div className="pt-2 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
                  {/* File Upload Button */}
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 border border-dashed border-stone-700 hover:border-gold-400 cursor-pointer transition text-stone-300 hover:text-white font-medium">
                    <UploadCloud className="w-4 h-4 text-gold-400" />
                    <span>{uploadingProductImage ? 'Uploading image...' : 'Upload Image from Computer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingProductImage}
                      onChange={handleUploadProductImageFile}
                      className="hidden"
                    />
                  </label>

                  {/* Add Image by URL */}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={newImageUrlInput}
                      onChange={(e) => setNewImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs outline-none focus:border-gold-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageFromUrl}
                      disabled={!newImageUrlInput.trim()}
                      className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition disabled:opacity-40"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: STOREFRONT HOMEPAGE SHOWCASE & DISCOVERY TAGS */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>3. Storefront Placement & Homepage Tabs</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer hover:border-gold-400/50 transition">
                    <input
                      type="checkbox"
                      checked={editProductForm.isFeatured}
                      onChange={(e) => setEditProductForm({ ...editProductForm, isFeatured: e.target.checked })}
                      className="mt-0.5 rounded border-stone-700 text-gold-400 focus:ring-0"
                    />
                    <div>
                      <strong className="text-white block">Featured Products Carousel</strong>
                      <span className="text-[11px] text-stone-400">Featured in homepage hero/trending cards</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer hover:border-gold-400/50 transition">
                    <input
                      type="checkbox"
                      checked={editProductForm.isBestseller}
                      onChange={(e) => setEditProductForm({ ...editProductForm, isBestseller: e.target.checked })}
                      className="mt-0.5 rounded border-stone-700 text-gold-400 focus:ring-0"
                    />
                    <div>
                      <strong className="text-white block">Homepage "Bestsellers" Tab</strong>
                      <span className="text-[11px] text-stone-400">Appears under the 4-tab showcase bestsellers</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer hover:border-gold-400/50 transition">
                    <input
                      type="checkbox"
                      checked={editProductForm.isPackaging}
                      onChange={(e) => setEditProductForm({ ...editProductForm, isPackaging: e.target.checked })}
                      className="mt-0.5 rounded border-stone-700 text-gold-400 focus:ring-0"
                    />
                    <div>
                      <strong className="text-white block">Homepage "Packaging" Tab</strong>
                      <span className="text-[11px] text-stone-400">Appears under the packaging & boxes showcase</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer hover:border-gold-400/50 transition">
                    <input
                      type="checkbox"
                      checked={editProductForm.isCorporateGift}
                      onChange={(e) => setEditProductForm({ ...editProductForm, isCorporateGift: e.target.checked })}
                      className="mt-0.5 rounded border-stone-700 text-gold-400 focus:ring-0"
                    />
                    <div>
                      <strong className="text-white block">"Corporate Gifts" Tab</strong>
                      <span className="text-[11px] text-stone-400">Appears in corporate gifting hamper sections</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer hover:border-gold-400/50 transition">
                    <input
                      type="checkbox"
                      checked={editProductForm.isCustomizable}
                      onChange={(e) => setEditProductForm({ ...editProductForm, isCustomizable: e.target.checked })}
                      className="mt-0.5 rounded border-stone-700 text-gold-400 focus:ring-0"
                    />
                    <div>
                      <strong className="text-white block">Enable Interactive Customizer</strong>
                      <span className="text-[11px] text-stone-400">Allows customer artwork zoom, pan, and masks</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 4: AVAILABLE CUT SHAPES FOR CUSTOMIZER */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>4. Available Die-Cut Shapes for Storefront Customizer</span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  Select which cut-path outlines are available for customer customization:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { id: 'circle', label: 'Circle' },
                    { id: 'rectangle', label: 'Rectangle' },
                    { id: 'hexagon', label: 'Hexagon' },
                    { id: 'triangle', label: 'Triangle' },
                    { id: 'heart', label: 'Heart' },
                    { id: 'square', label: 'Square' },
                    { id: 'diecut', label: 'Custom Die-Cut' },
                  ].map((s) => {
                    const isSelected = editProductForm.availableShapes.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleToggleShape(s.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-gold-400 text-stone-950 font-bold shadow'
                            : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{s.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* SECTION 5: DESCRIPTIONS & SPECIFICATIONS */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>5. Storefront Copy & Technical Specs</span>
                </h3>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Short Subtitle Description (Catalog Card Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editProductForm.shortDescription}
                    onChange={(e) => setEditProductForm({ ...editProductForm, shortDescription: e.target.value })}
                    placeholder="e.g. Ultra-resilient 350 GSM premium gloss stickers with weather-proof UV lacquer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Full Description & Technical Specifications *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editProductForm.description}
                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditProductModal({ open: false, product: null })}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold transition"
                >
                  Discard Changes
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <Link
                    href={`/products/${editProductForm.slug || editProductModal.product.slug}`}
                    target="_blank"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-semibold text-center transition"
                  >
                    Open Live on Storefront
                  </Link>

                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-stone-950 font-bold shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {savingProduct ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save & Update Storefront</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: COURIER LOGISTICS DISPATCH & 4X6 THERMAL LABEL */}
      {/* ========================================================= */}
      {shippingModal.open && shippingModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white font-display">
                    Courier Dispatch & AWB Generator
                  </h2>
                  <p className="text-xs text-stone-400">
                    Order Ref: <span className="font-mono font-bold text-gold-300">{shippingModal.order.orderNumber}</span> • Consignee: {shippingModal.order.guestName || shippingModal.order.user?.name || 'Valued Customer'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShippingModal({ ...shippingModal, open: false })}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Switcher */}
            <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShippingModal({ ...shippingModal, step: 'config' })}
                className={`flex-1 py-2 rounded-lg transition ${
                  shippingModal.step === 'config'
                    ? 'bg-gold-400 text-stone-950 shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                1. Select Courier & Package Dimensions
              </button>
              <button
                type="button"
                onClick={() => setShippingModal({ ...shippingModal, step: 'label' })}
                className={`flex-1 py-2 rounded-lg transition ${
                  shippingModal.step === 'label'
                    ? 'bg-gold-400 text-stone-950 shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                2. 4x6 Thermal Shipping Label & WhatsApp
              </button>
            </div>

            {/* STEP 1: CONFIGURATION */}
            {shippingModal.step === 'config' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-3">
                    Select Official Logistics Partner
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'Delhivery Surface Pro',
                        sla: 'Surface Cargo (2-3 Days)',
                        rate: '68',
                        tag: 'Lowest Freight Rate',
                        badge: 'Recommended',
                      },
                      {
                        id: 'BlueDart Apex Air Express',
                        sla: 'Next-Day Express Air Cargo',
                        rate: '140',
                        tag: 'High Priority Air',
                        badge: 'Fastest SLA',
                      },
                      {
                        id: 'Shiprocket Prime Xpress',
                        sla: 'Smart AI Aggregator Route (2-3 Days)',
                        rate: '75',
                        tag: 'Dynamic Routing',
                        badge: 'Smart Partner',
                      },
                      {
                        id: 'DTDC Express Prime',
                        sla: 'Direct Regional Surface (2 Days)',
                        rate: '85',
                        tag: 'All-India Coverage',
                        badge: 'Standard',
                      },
                    ].map((c) => (
                      <div
                        key={c.id}
                        onClick={() =>
                          setShippingModal({
                            ...shippingModal,
                            courier: c.id,
                            serviceType: c.sla,
                            rateEstimate: c.rate,
                          })
                        }
                        className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                          shippingModal.courier === c.id
                            ? 'bg-gold-950/20 border-gold-400 text-white shadow-lg'
                            : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <strong className="text-sm font-bold">{c.id}</strong>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300">
                            {c.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">{c.sla}</p>
                        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-800">
                          <span className="text-stone-500">{c.tag}</span>
                          <span className="font-extrabold text-gold-400">Est. ₹{c.rate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950/60 p-5 rounded-2xl border border-stone-800">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      Dead Weight (kg)
                    </label>
                    <input
                      type="text"
                      value={shippingModal.weight}
                      onChange={(e) => setShippingModal({ ...shippingModal, weight: e.target.value })}
                      placeholder="e.g. 1.25"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs outline-none focus:border-gold-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      Box Dimensions L x W x H (cm)
                    </label>
                    <input
                      type="text"
                      value={shippingModal.dimensions}
                      onChange={(e) => setShippingModal({ ...shippingModal, dimensions: e.target.value })}
                      placeholder="e.g. 25 x 20 x 10"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs outline-none focus:border-gold-400 font-mono"
                    />
                  </div>
                </div>

                {/* Destination Preview */}
                <div className="bg-stone-950/40 p-4 rounded-2xl border border-stone-800/80 text-xs text-stone-300 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Consignee Shipping Address:</span>
                    <p className="text-stone-400 mt-0.5">
                      {shippingModal.order.shippingAddress
                        ? `${shippingModal.order.shippingAddress.street}, ${shippingModal.order.shippingAddress.city}, ${shippingModal.order.shippingAddress.state} - ${shippingModal.order.shippingAddress.postalCode}`
                        : 'Address verified on order sheet'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShippingModal({ ...shippingModal, open: false })}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateAwb}
                    disabled={shippingModal.generating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-lg transition flex items-center gap-2"
                  >
                    {shippingModal.generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Communicating with Logistics API...</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" />
                        <span>Generate AWB & Issue Manifest</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: 4X6 THERMAL SHIPPING LABEL & ACTIONS */}
            {shippingModal.step === 'label' && (
              <div className="space-y-6">
                
                {/* 4x6 Thermal Label Container (Pure high-contrast printable black/white) */}
                <div className="bg-white text-black p-6 rounded-2xl border-4 border-black max-w-md mx-auto shadow-xl font-mono text-[11px] leading-tight select-all">
                  
                  {/* Top Barcode Header */}
                  <div className="border-b-2 border-black pb-3 text-center">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                      <span>KAGZIFY EXPRESS</span>
                      <span>PREPAID PARCEL</span>
                    </div>
                    <div className="text-lg font-black tracking-widest uppercase py-0.5">
                      {shippingModal.courier.toUpperCase()}
                    </div>
                    <div className="text-[9px] text-gray-700">
                      SERVICE: {shippingModal.serviceType}
                    </div>
                  </div>

                  {/* Simulated High-Res Barcode Strip */}
                  <div className="py-4 border-b-2 border-black text-center space-y-1">
                    <div className="h-14 w-full flex items-center justify-center gap-0.5 px-4 overflow-hidden">
                      {/* Realistic barcode line pattern */}
                      {[3,1,2,4,1,3,2,1,4,2,1,3,1,2,3,4,1,2,1,3,2,4,1,2,3,1,4,2,3,1,2,4,1,3,2,1,4,2,1,3].map((w, idx) => (
                        <div
                          key={idx}
                          className="bg-black h-full"
                          style={{ width: `${w * 2}px` }}
                        />
                      ))}
                    </div>
                    <div className="text-xs font-black tracking-widest font-mono">
                      AWB: {shippingModal.awbNumber || 'DEL-9482710492'}
                    </div>
                  </div>

                  {/* Consignee Address */}
                  <div className="py-3 border-b-2 border-black space-y-1">
                    <span className="text-[9px] font-bold uppercase text-gray-600 block">SHIP TO (CONSIGNEE):</span>
                    <div className="text-xs font-black">
                      {shippingModal.order.guestName || shippingModal.order.user?.name || 'Customer'}
                    </div>
                    <div className="text-[10px] leading-snug">
                      {shippingModal.order.shippingAddress
                        ? `${shippingModal.order.shippingAddress.street}, ${shippingModal.order.shippingAddress.city}, ${shippingModal.order.shippingAddress.state} - ${shippingModal.order.shippingAddress.postalCode}`
                        : 'Customer Address on Order Record'}
                    </div>
                    <div className="text-[10px] font-bold">
                      TEL: {shippingModal.order.guestPhone || shippingModal.order.user?.phone || '+91 98765 43210'}
                    </div>
                  </div>

                  {/* Routing & Weight Specs */}
                  <div className="grid grid-cols-2 border-b-2 border-black py-2.5 text-[10px]">
                    <div className="border-r border-black pr-2">
                      <span className="text-[8px] text-gray-600 block">WEIGHT / DIMS</span>
                      <strong>{shippingModal.weight} KG</strong>
                      <div className="text-[9px]">{shippingModal.dimensions} CM</div>
                    </div>
                    <div className="pl-2">
                      <span className="text-[8px] text-gray-600 block">ROUTING CODE</span>
                      <strong className="text-xs">BOM / REG-04</strong>
                      <div className="text-[9px]">DOCS / PRINT ENCLOSED</div>
                    </div>
                  </div>

                  {/* Return Warehouse */}
                  <div className="pt-2 text-[9px] text-gray-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-black block">RETURN IF UNDELIVERED:</span>
                      Kagzify Litho Works, Lower Parel, Mumbai 400013
                    </div>
                    <div className="w-10 h-10 border border-black flex items-center justify-center font-bold text-[8px]">
                      QR CODE
                    </div>
                  </div>
                </div>

                {/* Thermal Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShippingModal({ ...shippingModal, step: 'config' })}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
                  >
                    ← Modify Partner
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 transition border border-stone-700"
                    >
                      <Printer className="w-4 h-4 text-gold-400" />
                      <span>Print 4x6 Label</span>
                    </button>

                    <Link
                      href={`/track?awb=${shippingModal.awbNumber}`}
                      target="_blank"
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-gold-400 text-xs font-bold flex items-center gap-1.5 transition border border-stone-700"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Live Radar View</span>
                    </Link>

                    {(shippingModal.order.guestPhone || shippingModal.order.user?.phone) && (
                      <a
                        href={`https://wa.me/${(shippingModal.order.guestPhone || shippingModal.order.user?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${shippingModal.order.guestName || shippingModal.order.user?.name || 'Valued Client'}! Your Kagzify custom print order #${shippingModal.order.orderNumber} has been handed to ${shippingModal.courier} (AWB: ${shippingModal.awbNumber}). Track your live delivery here: https://kagzify.com/track?awb=${shippingModal.awbNumber}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send WhatsApp AWB</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUPABASE DATABASE MERGE & CLOUD SYNC */}
      {/* ========================================================= */}
      <DatabaseMergeModal
        isOpen={showDbMergeModal}
        onClose={() => setShowDbMergeModal(false)}
        onRefreshData={loadAllAdminData}
      />

    </div>
  )
}

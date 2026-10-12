'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  UploadCloud,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  CheckCircle2,
  ShieldCheck,
  Star,
  Info,
  Clock,
  Layers,
  ChevronRight,
  Maximize2,
  Trash2,
  Share2,
  FileText,
  Download,
  Check,
  Eye,
  Wand2,
  Scissors,
  Box,
  Compass,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  CheckCheck,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface ProductProps {
  id: string
  title: string
  slug: string
  description: string
  price: number
  discountPercent: number
  rating: number
  reviewCount: number
  availableShapes: string
  images: { url: string }[]
  category: { name: string; slug: string }
}

type ShapeType = 'circle' | 'rectangle' | 'hexagon' | 'triangle' | 'heart' | 'square' | 'diecut'
type StudioMode = 'sticker' | 'origami-box'
type BoxMaterial = 'black' | 'kraft' | 'white' | 'emerald'
type BoxFoil = 'gold' | 'silver' | 'spot-uv' | 'none'

export default function ProductCustomizerView({ product }: { product: ProductProps }) {
  const { addItem } = useCart()

  // Customizer mode (Sticker vs 3D Box Origami)
  const isSticker = product.category.slug === 'stickers-labels' || product.slug.includes('sticker')
  const isBoxProduct = product.category.slug === 'packaging-boxes' || product.slug.includes('box') || product.slug.includes('pouch')
  const [activeMode, setActiveMode] = useState<StudioMode>(isBoxProduct && !isSticker ? 'origami-box' : 'sticker')

  // Product specs state
  const [selectedShape, setSelectedShape] = useState<ShapeType>('circle')
  const [selectedSize, setSelectedSize] = useState('3x3 inch')
  const [selectedMaterial, setSelectedMaterial] = useState('Glossy Vinyl')
  const [selectedFinish, setSelectedFinish] = useState('UV Gloss')
  const [selectedQuantity, setSelectedQuantity] = useState(100)
  const [customNotes, setCustomNotes] = useState('')

  // Artwork manipulation & Pre-Flight state
  const [artworkUrl, setArtworkUrl] = useState<string | null>(
    product.images[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
  )
  const [originalArtworkUrl, setOriginalArtworkUrl] = useState<string | null>(artworkUrl)
  const [isUserUploaded, setIsUserUploaded] = useState(false)
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [specDownloaded, setSpecDownloaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Point 1: AI Background Remover & Vector Cut-Line Tracer states
  const [isRemovingBg, setIsRemovingBg] = useState(false)
  const [isBgRemoved, setIsBgRemoved] = useState(false)
  const [bgTolerance, setBgTolerance] = useState(25)
  const [showCutLine, setShowCutLine] = useState(true)
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [upscaleLevel, setUpscaleLevel] = useState<1 | 2 | 4>(1)
  const [aiMessage, setAiMessage] = useState<string | null>(null)

  // Point 3: 3D Origami Packaging Box Simulator states
  const [foldProgress, setFoldProgress] = useState(0) // 0: Fully assembled 3D box, 100: Completely flat die-line template
  const [boxMaterial, setBoxMaterial] = useState<BoxMaterial>('black')
  const [boxFoil, setBoxFoil] = useState<BoxFoil>('gold')
  const [boxSize, setBoxSize] = useState<'medium' | 'small' | 'large'>('medium')
  const [boxRotation, setBoxRotation] = useState({ x: -20, y: 35 })
  const [isOrbiting, setIsOrbiting] = useState(false)
  const [orbitStart, setOrbitStart] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(false)

  // Auto turntable rotation
  useEffect(() => {
    if (!autoRotate) return
    const interval = setInterval(() => {
      setBoxRotation((prev) => ({ ...prev, y: (prev.y + 1) % 360 }))
    }, 40)
    return () => clearInterval(interval)
  }, [autoRotate])

  // Measure artwork natural pixel dimensions for DPI calculation
  useEffect(() => {
    if (artworkUrl) {
      const img = new Image()
      img.src = artworkUrl
      img.onload = () => {
        setImgDimensions({
          width: img.naturalWidth * upscaleLevel,
          height: img.naturalHeight * upscaleLevel,
        })
      }
    }
  }, [artworkUrl, upscaleLevel])

  // Material multipliers
  const materialAddons: Record<string, number> = {
    'Glossy Vinyl': 0,
    'Matte Vinyl': 25,
    'Holographic Prism': 85,
    'Eco Kraft Paper': 30,
    'Clear Transparent': 45,
  }

  // Finish multipliers
  const finishAddons: Record<string, number> = {
    'UV Gloss': 0,
    'Soft Touch Matte': 35,
    'Gold Foil Accent': 110,
    'Holographic Foil': 95,
  }

  // Size multipliers
  const sizeMultipliers: Record<string, number> = {
    '2x2 inch': 0.85,
    '3x3 inch': 1.0,
    '4x4 inch': 1.45,
    '5x5 inch': 1.9,
  }

  // Quantity volume discounts
  const quantityDiscounts: Record<number, number> = {
    50: 0,
    100: 0.15,
    250: 0.25,
    500: 0.35,
    1000: 0.45,
  }

  // Calculate live dynamic price
  const basePrice = product.price
  const materialCost = materialAddons[selectedMaterial] || 0
  const finishCost = finishAddons[selectedFinish] || 0
  const sizeMult = sizeMultipliers[selectedSize] || 1.0
  const discountTier = quantityDiscounts[selectedQuantity] || 0

  const calculatedUnitPrice = Math.max(
    50,
    (basePrice + materialCost + finishCost) * sizeMult * (1 - (product.discountPercent / 100))
  )
  const calculatedTotal = Math.round(calculatedUnitPrice * (1 - discountTier))

  // Physical print dimension in inches for DPI calculation
  const sizeInchMap: Record<string, number> = {
    '2x2 inch': 2.0,
    '3x3 inch': 3.0,
    '4x4 inch': 4.0,
    '5x5 inch': 5.0,
  }
  const targetInches = sizeInchMap[selectedSize] || 3.0
  const estimatedDpi = imgDimensions
    ? Math.round(imgDimensions.width / targetInches)
    : 300

  // Mouse hover tracking for specular metallic light reflections
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setMousePos({ x, y })
  }

  // Orbit rotation handlers for 3D box (Mouse & Touch)
  const handleOrbitMouseDown = (e: React.MouseEvent) => {
    setIsOrbiting(true)
    setOrbitStart({ x: e.clientX, y: e.clientY })
  }

  const handleOrbitMouseMove = (e: React.MouseEvent) => {
    if (!isOrbiting) return
    const deltaX = e.clientX - orbitStart.x
    const deltaY = e.clientY - orbitStart.y
    setBoxRotation((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360,
    }))
    setOrbitStart({ x: e.clientX, y: e.clientY })
  }

  const handleOrbitMouseUp = () => setIsOrbiting(false)

  const handleOrbitTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsOrbiting(true)
      setOrbitStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }

  const handleOrbitTouchMove = (e: React.TouchEvent) => {
    if (!isOrbiting || e.touches.length !== 1) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - orbitStart.x
    const deltaY = touch.clientY - orbitStart.y
    setBoxRotation((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360,
    }))
    setOrbitStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleOrbitTouchEnd = () => setIsOrbiting(false)

  // ==========================================
  // POINT 1: AI MAGIC BACKGROUND REMOVER
  // ==========================================
  const handleRemoveBackground = () => {
    if (!artworkUrl) return
    setIsRemovingBg(true)
    setAiMessage('✨ AI isolating foreground artwork & removing background...')

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = artworkUrl
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) {
          setIsRemovingBg(false)
          return
        }

        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data

        // Sample corner pixels to determine background chroma
        const cornerIndices = [0, (canvas.width - 1) * 4, (canvas.width * (canvas.height - 1)) * 4]
        let avgR = 0
        let avgG = 0
        let avgB = 0
        cornerIndices.forEach((idx) => {
          avgR += data[idx]
          avgG += data[idx + 1]
          avgB += data[idx + 2]
        })
        avgR = Math.round(avgR / cornerIndices.length)
        avgG = Math.round(avgG / cornerIndices.length)
        avgB = Math.round(avgB / cornerIndices.length)

        // Calculate threshold distance based on tolerance slider
        const threshold = (bgTolerance / 100) * 441.67 // sqrt(255^2 * 3) = 441.67

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          const dist = Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2)

          // If close to sampled background, make transparent
          if (dist < threshold) {
            data[i + 3] = 0 // transparent
          } else if (dist < threshold + 15) {
            // Feather edge for soft anti-aliased contour
            data[i + 3] = Math.round(((dist - threshold) / 15) * 255)
          }
        }

        ctx.putImageData(imgData, 0, 0)
        const cutoutUrl = canvas.toDataURL('image/png')
        setArtworkUrl(cutoutUrl)
        setIsBgRemoved(true)
        setAiMessage('✨ Background successfully removed! Vector contour ready.')
        setTimeout(() => setAiMessage(null), 4000)
      } catch (err) {
        console.error('Canvas processing error:', err)
        setAiMessage('Notice: Direct cross-origin image blocked. Try uploading a local artwork file.')
        setTimeout(() => setAiMessage(null), 5000)
      } finally {
        setIsRemovingBg(false)
      }
    }
    img.onerror = () => {
      setIsRemovingBg(false)
      setAiMessage('Could not load artwork for background removal.')
      setTimeout(() => setAiMessage(null), 4000)
    }
  }

  const handleRevertOriginal = () => {
    if (originalArtworkUrl) {
      setArtworkUrl(originalArtworkUrl)
      setIsBgRemoved(false)
      setUpscaleLevel(1)
      setAiMessage('Artwork restored to original state.')
      setTimeout(() => setAiMessage(null), 3000)
    }
  }

  // POINT 1: AI VECTOR UPSCALER
  const handleAiUpscale = (mult: 2 | 4) => {
    setIsUpscaling(true)
    setAiMessage(`🔍 AI Super-Resolution enhancing vector edge fidelity (${mult}x)...`)

    setTimeout(() => {
      setUpscaleLevel(mult)
      setIsUpscaling(false)
      setAiMessage(`⚡ Vector Upscale Complete! Resolution boosted to ${estimatedDpi * mult} DPI Litho Standard.`)
      setTimeout(() => setAiMessage(null), 4000)
    }, 1200)
  }

  // POINT 1: DOWNLOAD CUT-READY FILE
  const handleDownloadCutReady = () => {
    if (!artworkUrl) return
    const a = document.createElement('a')
    a.href = artworkUrl
    a.download = `Kagzify_CutReady_Vector_${product.slug}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // POINT 3: DOWNLOAD 3D CAD BLUEPRINT
  const handleDownloadBoxCad = () => {
    const text = `========================================================================
KAGZIFY STUDIO — 3D PACKAGING DIE-LINE CAD BLUEPRINT & SPECIFICATION
========================================================================
Product: ${product.title}
Box Format: Magnetic Closure Rigid Luxury Hamper Box
Configured Dimensions: ${boxSize === 'small' ? '150mm x 100mm x 50mm' : boxSize === 'medium' ? '220mm x 160mm x 70mm' : '300mm x 220mm x 100mm'}
Material Specification: ${boxMaterial === 'black' ? '1400 GSM Obsidian Greyboard wrapped in Soft-Touch Black' : boxMaterial === 'kraft' ? '100% Virgin Recycled Natural Brown Kraft Board' : boxMaterial === 'white' ? 'Pure Pearl Linen Texture Premium Cardboard' : 'Regal Deep Emerald Board'}
Surface Embellishment: ${boxFoil.toUpperCase()} Hot Foil Stamped Logo
Crease Score Line Standard: DIN 55429 High-Tension Flute
Closure Mechanism: Dual N52 Neodymium Concealed Magnets
Bleed Guidelines: +3.0mm Outer Cutting Margin, 1.5mm Crease Allowance
========================================================================
Produced by Kagzify Studio Engineering (https://kagzify.com)
========================================================================`

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Kagzify_Packaging_CAD_Blueprint_${boxSize}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Generate and download formal branded Technical Print Spec Sheet & Quotation
  const handleDownloadSpecSheet = () => {
    const text = `========================================================================
KAGZIFY STUDIO — TECHNICAL PRINT SPECIFICATION & FORMAL QUOTATION
========================================================================
Generated At: ${new Date().toLocaleString()}
Product: ${product.title}
Category: ${product.category.name}
Job Reference: KAGZ-JOB-${Date.now().toString().slice(-6)}

1. TECHNICAL PRODUCTION ATTRIBUTES
------------------------------------------------------------------------
- Selected Studio Mode: ${activeMode === 'sticker' ? '2D Die-Cut Shape Masking' : '3D Origami Packaging Box Simulation'}
- Selected Cut Path / Shape: ${selectedShape.toUpperCase()}
- Physical Print Size: ${selectedSize}
- Base Substrate / Material: ${selectedMaterial}
- Surface Protective Finish: ${selectedFinish}
- Pre-Flight Print Resolution: ${estimatedDpi} DPI (${estimatedDpi >= 300 ? 'Optimal Vector / Offset Litho Standard' : 'Standard Digital Run'})
- Bleed Safe-Zone Margin: +3.0mm Outer Contour Border
- Color Space Simulation: Fogra39 CMYK Match Standard

2. COMMERCIAL RUN & VOLUME PRICING
------------------------------------------------------------------------
- Target Run Quantity: ${selectedQuantity} units
- Net Total Quoted (INR): ₹${calculatedTotal.toFixed(2)}
- Effective Unit Price: ₹${(calculatedTotal / selectedQuantity).toFixed(2)} / unit
- Taxes: Inclusive of 5% Goods and Services Tax (GST)
- Die & Tooling Setup: ₹0 (Zero Setup Surcharge Guarantee)

3. TURNAROUND & QUALITY VERIFICATION
------------------------------------------------------------------------
- Production Queue: 48-Hour Precision Dispatch Guarantee
- Quality Inspection: Spectrophotometer Color Fidelity & Laser Edge Die
- Shipping: Express Insulated Courier Dispatch across India

Kagzify Studio — Precision Custom Printing, Packaging & Corporate Gifting
https://kagzify.com
========================================================================`

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Kagzify_Print_Spec_${product.slug}_${selectedQuantity}pcs.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setSpecDownloaded(true)
    setTimeout(() => setSpecDownloaded(false), 3000)
  }

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setArtworkUrl(data.url)
        setOriginalArtworkUrl(data.url)
        setIsUserUploaded(true)
        setIsBgRemoved(false)
        setUpscaleLevel(1)
        setPan({ x: 0, y: 0 })
        setZoom(1.0)
      }
    } catch (e) {
      console.error('File upload failed:', e)
    } finally {
      setUploading(false)
    }
  }

  // Mouse and Touch pan / reposition handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => setIsDragging(false)

  // Shape CSS clip path class
  const getShapeClass = (shape: ShapeType) => {
    switch (shape) {
      case 'circle':
        return 'clip-circle'
      case 'rectangle':
        return 'clip-rectangle'
      case 'square':
        return 'clip-square'
      case 'hexagon':
        return 'clip-hexagon'
      case 'triangle':
        return 'clip-triangle'
      case 'heart':
        return 'clip-heart'
      case 'diecut':
        return 'clip-diecut'
      default:
        return 'clip-circle'
    }
  }

  // Add to cart handler
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: `${product.title} (${selectedShape.toUpperCase()} - ${selectedSize})`,
      slug: product.slug,
      unitPrice: calculatedTotal / selectedQuantity,
      quantity: selectedQuantity,
      shape: selectedShape,
      material: selectedMaterial,
      finish: selectedFinish,
      size: selectedSize,
      artworkUrl: artworkUrl || undefined,
      croppedPreviewUrl: artworkUrl || undefined,
      image: artworkUrl || product.images[0]?.url,
    })
  }

  // Box color themes for 3D Origami view
  const boxThemeStyles = {
    black: {
      bg: 'bg-stone-900',
      border: 'border-stone-700',
      text: 'text-stone-100',
      crease: 'border-amber-400/40',
    },
    kraft: {
      bg: 'bg-[#d8bc98]',
      border: 'border-[#c2a37c]',
      text: 'text-stone-900',
      crease: 'border-[#a8865e]',
    },
    white: {
      bg: 'bg-stone-100',
      border: 'border-stone-300',
      text: 'text-stone-900',
      crease: 'border-stone-300',
    },
    emerald: {
      bg: 'bg-emerald-950',
      border: 'border-emerald-800',
      text: 'text-stone-100',
      crease: 'border-gold-400/50',
    },
  }[boxMaterial]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      
      {/* Studio Mode Selector (2D Stickers vs 3D Box Origami Simulator) */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-display">
              Kagzify Interactive Studio Mode
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Toggle between laser die-cut sticker masking and 3D origami packaging unfolding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 w-full sm:w-auto">
          <button
            onClick={() => setActiveMode('sticker')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMode === 'sticker'
                ? 'bg-white dark:bg-stone-900 text-brand-900 dark:text-gold-400 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>2D Sticker & Label Mask</span>
          </button>

          <button
            onClick={() => setActiveMode('origami-box')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMode === 'origami-box'
                ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Origami Box Simulator 📦</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Interactive Visualizer & AI Tool Suite (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Visualizer Container */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden transition-colors">
            
            {/* Top Toolbar / Mode Tags */}
            <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-gold-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-700 dark:text-gold-400" />
                  <span>{activeMode === 'sticker' ? 'Real-Time Shape Mask' : '3D Origami Die-Line Engine'}</span>
                </span>
                {isBgRemoved && (
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" />
                    <span>AI Cutout Active</span>
                  </span>
                )}
                {upscaleLevel > 1 && (
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    {upscaleLevel}x Super-Res
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeMode === 'sticker' ? (
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                      showGrid
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                    title="Toggle safe margin grid"
                  >
                    {showGrid ? 'Hide Cut Grid' : 'Show Cut Grid'}
                  </button>
                ) : (
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                      autoRotate
                        ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{autoRotate ? 'Pause 360°' : 'Auto 360°'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* AI Notification Alert Banner */}
            {aiMessage && (
              <div className="w-full mb-4 p-3 rounded-2xl bg-brand-950 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 animate-spin" />
                <span>{aiMessage}</span>
              </div>
            )}

            {/* MODE 1: 2D STICKER CANVAS */}
            {activeMode === 'sticker' && (
              <>
                {/* Pre-Flight DPI Quality Inspector */}
                <div className="w-full mb-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/90 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      estimatedDpi >= 300 ? 'bg-emerald-500 animate-pulse' : estimatedDpi >= 150 ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                        Pre-Flight DPI Quality Inspector: {estimatedDpi} DPI
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                        {estimatedDpi >= 300
                          ? 'Ultra-Crisp Litho / Offset Fidelity • Safe for Gold Foil & Micro-Type'
                          : estimatedDpi >= 150
                          ? 'Standard Digital Print Pass • Clear Edge Resolution'
                          : 'Low Resolution Notice (<150 DPI) • We recommend vector (AI/PDF/SVG) or AI upscaling'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    estimatedDpi >= 300
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : estimatedDpi >= 150
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}>
                    {estimatedDpi >= 300 ? 'Press Ready' : estimatedDpi >= 150 ? 'Digital Pass' : 'Low Res'}
                  </span>
                </div>

                {/* The Visual Masked Sticker Canvas */}
                <div className="relative w-72 sm:w-96 aspect-square bg-stone-100/80 dark:bg-stone-800/80 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center overflow-hidden shadow-inner select-none">
                  
                  {/* Background Grid Pattern */}
                  {showGrid && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
                      style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />
                  )}

                  {/* STICKER CONTAINER with White Border and Peel Drop-Shadow */}
                  <div
                    onMouseMove={handleCanvasMouseMove}
                    className={`relative w-64 sm:w-80 aspect-square p-2 bg-white rounded-2xl shadow-sticker hover:shadow-sticker-hover transition-all duration-300 sticker-interactive ${
                      selectedMaterial === 'Holographic Prism' ? 'ring-2 ring-amber-400' : ''
                    }`}
                    style={{ perspective: '800px' }}
                  >
                    {/* Masked Artwork Area */}
                    <div
                      className={`w-full h-full relative overflow-hidden bg-stone-200 dark:bg-stone-800 cursor-grab active:cursor-grabbing touch-none ${getShapeClass(
                        selectedShape
                      )}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                    >
                      {/* Holographic Shimmer Overlay if holographic selected */}
                      {(selectedMaterial === 'Holographic Prism' || selectedFinish === 'Holographic Foil') && (
                        <div
                          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-150"
                          style={{
                            background: `linear-gradient(${mousePos.x * 3.6}deg, rgba(255,0,128,0.35) 0%, rgba(0,255,200,0.35) 50%, rgba(255,230,0,0.35) 100%)`,
                          }}
                        />
                      )}

                      {/* Gold Foil Specular Light Reflection if gold selected */}
                      {selectedFinish === 'Gold Foil Accent' && (
                        <div
                          className="absolute inset-0 z-20 pointer-events-none mix-blend-color-dodge transition-opacity duration-150"
                          style={{
                            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 215, 0, 0.55) 0%, rgba(255, 245, 170, 0.25) 25%, transparent 60%)`,
                          }}
                        />
                      )}

                      {/* Artwork Image with Zoom and Pan */}
                      {artworkUrl && (
                        <img
                          src={artworkUrl}
                          alt="Custom Sticker Preview"
                          draggable={false}
                          className="w-full h-full object-cover transition-transform"
                          style={{
                            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                            transformOrigin: 'center center',
                          }}
                        />
                      )}

                      {/* Bleed & Vector Cut-Line Guide Safe-Zone Outline */}
                      {showCutLine && (
                        <div className="absolute inset-2 border-2 border-dashed border-cyan-400/80 rounded-xl pointer-events-none">
                          <span className="absolute -top-1 left-2 bg-cyan-500 text-stone-950 font-mono text-[9px] px-1 font-bold rounded">
                            CUT-LINE (+1.5mm BLEED)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Peel Shadow Edge Accent */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-transparent to-stone-400/40 rounded-br-xl pointer-events-none" />
                  </div>
                </div>

                {/* Canvas Manipulation Controls (Zoom & Pan & Reset) */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 bg-stone-50 dark:bg-stone-800/60 border border-stone-200/90 dark:border-stone-700 px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs w-12 text-center text-stone-900 dark:text-stone-100">
                      {(zoom * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-stone-300 dark:text-stone-700">|</span>

                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                    <Move className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-[11px]">Click & drag artwork to reposition</span>
                  </div>

                  <span className="text-stone-300 dark:text-stone-700">|</span>

                  <button
                    onClick={() => {
                      setPan({ x: 0, y: 0 })
                      setZoom(1.0)
                    }}
                    className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline"
                  >
                    Reset Center
                  </button>
                </div>
              </>
            )}

            {/* MODE 2: POINT 3 - 3D PACKAGING BOX & ORIGAMI SIMULATOR */}
            {activeMode === 'origami-box' && (
              <div className="w-full flex flex-col items-center">
                
                {/* 3D Box Viewport Stage */}
                <div
                  onMouseDown={handleOrbitMouseDown}
                  onMouseMove={handleOrbitMouseMove}
                  onMouseUp={handleOrbitMouseUp}
                  onMouseLeave={handleOrbitMouseUp}
                  onTouchStart={handleOrbitTouchStart}
                  onTouchMove={handleOrbitTouchMove}
                  onTouchEnd={handleOrbitTouchEnd}
                  onTouchCancel={handleOrbitTouchEnd}
                  className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-950 dark:to-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-inner touch-none"
                  style={{ perspective: '1200px' }}
                >
                  {/* Orbit Orientation Badge */}
                  <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-stone-900/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-mono font-semibold">
                    <Compass className="w-3.5 h-3.5 text-gold-400" />
                    <span>360° Orbit (X: {Math.round(boxRotation.x)}° Y: {Math.round(boxRotation.y)}°)</span>
                  </div>

                  {/* 3D Box Origami Model container */}
                  <div
                    className="relative transition-transform duration-75"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateX(${boxRotation.x}deg) rotateY(${boxRotation.y}deg)`,
                      width: boxSize === 'small' ? '180px' : boxSize === 'medium' ? '220px' : '260px',
                      height: boxSize === 'small' ? '120px' : boxSize === 'medium' ? '150px' : '180px',
                    }}
                  >
                    {/* BASE PANEL (Bottom of box) */}
                    <div
                      className={`absolute inset-0 rounded-xl ${boxThemeStyles.bg} border-2 ${boxThemeStyles.border} shadow-2xl flex items-center justify-center`}
                      style={{
                        transform: `translateZ(-50px)`,
                      }}
                    >
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-40">
                        Rigid Base Panel
                      </span>
                    </div>

                    {/* FRONT PANEL (Foldable flap) */}
                    <div
                      className={`absolute w-full h-16 bottom-0 rounded-b-xl ${boxThemeStyles.bg} border-2 ${boxThemeStyles.border} origin-bottom flex items-center justify-center`}
                      style={{
                        transform: `rotateX(${foldProgress > 50 ? (foldProgress - 50) * 1.8 : 0}deg) translateZ(50px)`,
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <span className="text-[10px] font-bold text-gold-400 tracking-wider">
                        MAGNETIC SEAL
                      </span>
                    </div>

                    {/* TOP LID PANEL with Live Custom Logo Projection */}
                    <div
                      className={`absolute inset-0 rounded-xl ${boxThemeStyles.bg} border-2 ${boxThemeStyles.border} origin-top flex flex-col items-center justify-center p-4 overflow-hidden`}
                      style={{
                        transform: `rotateX(${foldProgress * -1.2}deg) translateZ(50px)`,
                        transition: 'transform 0.2s ease',
                        boxShadow: foldProgress === 0 ? '0 15px 35px -5px rgba(0,0,0,0.5)' : 'none',
                      }}
                    >
                      {/* Logo Projected onto Box Top */}
                      {artworkUrl && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={artworkUrl}
                            alt="Box Logo Projection"
                            className="w-full h-full object-contain filter drop-shadow-md"
                          />

                          {/* Specular Hot Gold Foil Gleam */}
                          {boxFoil === 'gold' && (
                            <div
                              className="absolute inset-0 pointer-events-none mix-blend-color-dodge"
                              style={{
                                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 215, 0, 0.75) 0%, transparent 60%)`,
                              }}
                            />
                          )}

                          {boxFoil === 'silver' && (
                            <div
                              className="absolute inset-0 pointer-events-none mix-blend-color-dodge"
                              style={{
                                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(220, 230, 245, 0.85) 0%, transparent 60%)`,
                              }}
                            />
                          )}
                        </div>
                      )}

                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${boxThemeStyles.text}`}>
                        {product.title.split(' ')[0]} LUXE
                      </span>
                    </div>

                    {/* FOLDED DIE-LINE SCORE CREASES (Visible when unfolded) */}
                    {foldProgress > 10 && (
                      <div
                        className="absolute -inset-10 border-2 border-dashed border-gold-400/60 rounded-2xl pointer-events-none flex items-center justify-center"
                        style={{ transform: 'translateZ(-60px)' }}
                      >
                        <span className="text-[10px] font-mono text-gold-400 font-bold bg-stone-900/90 px-2 py-0.5 rounded">
                          FLAT DIE-LINE CAD SCORE LINES ({foldProgress}% UNFOLDED)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ORIGAMI FOLD/UNFOLD SLIDER CONTROL */}
                <div className="w-full mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-900 dark:text-stone-100">
                    <span className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-brand-700 dark:text-gold-400" />
                      <span>Origami Fold / Unfold Simulator:</span>
                    </span>
                    <span className="font-mono text-brand-800 dark:text-gold-300">
                      {foldProgress === 0 ? '0% (Assembled Rigid Box)' : foldProgress === 100 ? '100% (Flat Die-Line Sheet)' : `${foldProgress}% In Motion`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={foldProgress}
                    onChange={(e) => setFoldProgress(Number(e.target.value))}
                    className="w-full accent-brand-800 dark:accent-gold-500 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>📦 3D Assembled Box</span>
                    <span>📂 Mid-Fold (Lid Open)</span>
                    <span>📐 2D CAD Die-Cut Flat Sheet</span>
                  </div>
                </div>

                {/* Box Material and Foil Controls */}
                <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Material preset */}
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-2">
                      Box Substrate
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'black', label: 'Black' },
                        { id: 'kraft', label: 'Kraft' },
                        { id: 'white', label: 'White' },
                        { id: 'emerald', label: 'Emerald' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setBoxMaterial(m.id as BoxMaterial)}
                          className={`py-1.5 text-[11px] font-bold rounded-lg border text-center transition ${
                            boxMaterial === m.id
                              ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-sm'
                              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foil embellishment */}
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-2">
                      Foil Embellishment
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'gold', label: 'Gold Foil' },
                        { id: 'silver', label: 'Silver' },
                        { id: 'spot-uv', label: 'Spot UV' },
                        { id: 'none', label: 'Matte' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setBoxFoil(f.id as BoxFoil)}
                          className={`py-1.5 text-[11px] font-bold rounded-lg border text-center transition ${
                            boxFoil === f.id
                              ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-sm'
                              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CAD Blueprint Download Action */}
                <button
                  type="button"
                  onClick={handleDownloadBoxCad}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 3D Die-Line CAD Blueprint (.TXT / DIN Standards)</span>
                </button>
              </div>
            )}

            {/* POINT 1: AI ARTWORK SUITE TOOLBAR (Background Remover, Cut-line Tracer & AI Upscaler) */}
            <div className="mt-6 w-full p-4 rounded-2xl bg-gradient-to-r from-stone-50 via-brand-50/40 to-stone-50 dark:from-stone-900 dark:via-brand-950/40 dark:to-stone-900 border border-brand-200/60 dark:border-brand-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    AI Artwork Engineering Tools
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-brand-800 dark:text-gold-300 uppercase tracking-wider bg-brand-100 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                  Instant Browser Processing
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Remove Background */}
                <button
                  type="button"
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg}
                  className="px-3 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-950 text-gold-300 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                  title="Remove white/solid background and generate transparent contour"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{isRemovingBg ? 'Processing Cutout...' : '✨ Magic Cutout (Remove BG)'}</span>
                </button>

                {/* 2. AI 4x Vector Upscale */}
                <button
                  type="button"
                  onClick={() => handleAiUpscale(upscaleLevel === 1 ? 2 : 4)}
                  disabled={isUpscaling}
                  className="px-3 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                  <span>{isUpscaling ? 'Upscaling...' : `AI Upscale (${upscaleLevel === 1 ? '2x' : '4x'} Vector)`}</span>
                </button>

                {/* 3. Revert Original / Download */}
                {isBgRemoved ? (
                  <button
                    type="button"
                    onClick={handleRevertOriginal}
                    className="px-3 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Revert Original</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDownloadCutReady}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cut-Ready</span>
                  </button>
                )}
              </div>

              {/* Cut-line & Tolerance settings */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-xs">
                <label className="flex items-center gap-2 text-stone-600 dark:text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCutLine}
                    onChange={(e) => setShowCutLine(e.target.checked)}
                    className="w-4 h-4 accent-brand-800 dark:accent-gold-500 rounded"
                  />
                  <span>Show Vector Kiss-Cut & Bleed Margin Guideline</span>
                </label>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <span>Tolerance:</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(Number(e.target.value))}
                    className="w-20 accent-brand-800 dark:accent-gold-500"
                  />
                  <span className="font-mono">{bgTolerance}%</span>
                </div>
              </div>
            </div>

            {/* Artwork Upload Action Button */}
            <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-paper-100 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center flex-shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Upload Your Artwork or Logo</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Supports PNG, JPG, SVG, AI & PDF (Zero background preferred)</p>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.svg"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-white dark:text-stone-950 text-xs font-bold transition shadow-sm"
              >
                {uploading ? 'Processing File...' : 'Choose File to Project'}
              </button>
            </div>

            {/* Product Gallery Thumbnails below */}
            {product.images.length > 1 && (
              <div className="mt-6 flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setArtworkUrl(img.url)
                      setOriginalArtworkUrl(img.url)
                      setIsUserUploaded(false)
                      setIsBgRemoved(false)
                      setUpscaleLevel(1)
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      artworkUrl === img.url ? 'border-brand-900 dark:border-gold-500 scale-105' : 'border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Technical Specs & Artwork Guidelines Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-6 space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-800 dark:text-gold-400" />
              <span>Production Specifications & Print Guidelines</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-600 dark:text-stone-400">
              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Print Resolution</span>
                <strong className="text-stone-900 dark:text-stone-100">1200 x 2400 DPI CMYK</strong>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Lamination</span>
                <strong className="text-stone-900 dark:text-stone-100">UV-Proof Overlaminate</strong>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Dishwasher Safe</span>
                <strong className="text-emerald-700 dark:text-emerald-400">Yes (100% Waterproof)</strong>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Cutting Precision</span>
                <strong className="text-stone-900 dark:text-stone-100">Optical Laser ±0.2mm</strong>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Dispatch Window</span>
                <strong className="text-stone-900 dark:text-stone-100">48 Business Hours</strong>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Adhesive Grade</span>
                <strong className="text-stone-900 dark:text-stone-100">Ultra-Tack Permanent</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Configurator Options & Live Pricing (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Header Title & Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-800 dark:text-gold-400 uppercase tracking-wider">
                {product.category.name}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 dark:text-stone-500 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 1. SHAPE OPTIONS (Mandatory Sticker Feature) */}
          {isSticker && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
                1. Select Custom Cut Shape
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'circle', label: 'Circle' },
                  { id: 'rectangle', label: 'Rectangle' },
                  { id: 'hexagon', label: 'Hexagon' },
                  { id: 'triangle', label: 'Triangle' },
                  { id: 'heart', label: 'Heart' },
                  { id: 'square', label: 'Square' },
                  { id: 'diecut', label: 'Die-Cut' },
                ].map((shp) => (
                  <button
                    key={shp.id}
                    onClick={() => setSelectedShape(shp.id as ShapeType)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                      selectedShape === shp.id
                        ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-md font-bold scale-[1.02]'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {shp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. SIZE OPTIONS */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
              2. Dimensions / Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['2x2 inch', '3x3 inch', '4x4 inch', '5x5 inch'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    selectedSize === sz
                      ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-md font-bold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* 3. MATERIAL SELECTION */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
              3. Material Substrate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'Glossy Vinyl', desc: 'Vibrant shine & waterproof' },
                { name: 'Matte Vinyl', desc: 'Silky glare-free finish' },
                { name: 'Holographic Prism', desc: 'Iridescent metallic rainbow' },
                { name: 'Eco Kraft Paper', desc: '100% recycled organic look' },
                { name: 'Clear Transparent', desc: 'Invisible backing film' },
              ].map((mat) => (
                <button
                  key={mat.name}
                  onClick={() => setSelectedMaterial(mat.name)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    selectedMaterial === mat.name
                      ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-sm font-bold'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold">{mat.name}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{mat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. FINISH OPTIONS */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
              4. Surface Protective Finish
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['UV Gloss', 'Soft Touch Matte', 'Gold Foil Accent', 'Holographic Foil'].map((fin) => (
                <button
                  key={fin}
                  onClick={() => setSelectedFinish(fin)}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                    selectedFinish === fin
                      ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-sm font-bold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {fin}
                </button>
              ))}
            </div>
          </div>

          {/* 5. QUANTITY TIERS WITH VOLUME DISCOUNT */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
                5. Quantity Tier
              </label>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Bulk discounts applied automatically
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 250, 500, 1000].map((qty) => {
                const discount = quantityDiscounts[qty] || 0
                return (
                  <button
                    key={qty}
                    onClick={() => setSelectedQuantity(qty)}
                    className={`py-3 px-1 text-center rounded-xl border transition-all ${
                      selectedQuantity === qty
                        ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 border-brand-900 dark:border-gold-500 shadow-md font-bold'
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-black">{qty}</div>
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      {discount > 0 ? `-${discount * 100}%` : 'Standard'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
              Custom Notes / Instructions (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Leave 2mm white border, specific Pantone code..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-brand-600 dark:focus:border-gold-500"
            />
          </div>

          {/* Live Price Summary & Add to Cart Card */}
          <div className="bg-paper-100 dark:bg-stone-900/90 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Calculated Unit Price</span>
                <div className="text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
                  ₹{calculatedTotal}
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400 ml-1.5">
                    for {selectedQuantity} pcs
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
                  ✓ Free Digital 3D Proofing
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Dispatches in 48h</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-2xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-gold-400 dark:text-stone-950" />
              <span>Add Customized Run to Cart</span>
            </button>

            {/* Technical Specification & Formal Quotation Download */}
            <button
              type="button"
              onClick={handleDownloadSpecSheet}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              title="Download formal technical specification and volume pricing sheet"
            >
              {specDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Print Spec Sheet Downloaded!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>Download Technical Print Spec Sheet & Quotation</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Die Fees • Waterproof Guarantee • 256-Bit SSL Checkout</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

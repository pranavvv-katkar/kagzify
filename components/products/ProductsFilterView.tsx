'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  SlidersHorizontal,
  ArrowRight,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface ProductItem {
  id: string
  title: string
  slug: string
  price: number
  discountPercent: number
  rating: number
  reviewCount: number
  baseStock: number
  availableShapes: string
  images: { url: string }[]
  category: { id: string; name: string; slug: string }
  isCustomizable?: boolean
}

interface CategoryItem {
  id: string
  name: string
  slug: string
}

export default function ProductsFilterView({
  initialProducts,
  categories,
  initialCategory,
  initialSearch,
}: {
  initialProducts: ProductItem[]
  categories: CategoryItem[]
  initialCategory?: string
  initialSearch?: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all')
  const [search, setSearch] = useState<string>(initialSearch || '')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [maxPrice, setMaxPrice] = useState<number>(1000)
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false)
  const [selectedShape, setSelectedShape] = useState<string>('all')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false)

  const shapesList = ['circle', 'rectangle', 'hexagon', 'triangle', 'heart', 'square', 'diecut']

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category.slug !== selectedCategory) return false

        // Search query
        if (
          search.trim() &&
          !p.title.toLowerCase().includes(search.toLowerCase()) &&
          !p.category.name.toLowerCase().includes(search.toLowerCase())
        ) {
          return false
        }

        // Max price
        const finalPrice = p.price * (1 - p.discountPercent / 100)
        if (finalPrice > maxPrice) return false

        // In stock
        if (onlyInStock && p.baseStock <= 0) return false

        // Shape filter
        if (selectedShape !== 'all' && !p.availableShapes?.includes(selectedShape)) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        const priceA = a.price * (1 - a.discountPercent / 100)
        const priceB = b.price * (1 - b.discountPercent / 100)

        if (sortBy === 'price-asc') return priceA - priceB
        if (sortBy === 'price-desc') return priceB - priceA
        if (sortBy === 'rating') return b.rating - a.rating
        return 0 // Default featured
      })
  }, [initialProducts, selectedCategory, search, sortBy, maxPrice, onlyInStock, selectedShape])

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSearch('')
    setSortBy('featured')
    setMaxPrice(1000)
    setOnlyInStock(false)
    setSelectedShape('all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner / Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
          All Products & Collections
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
          Showing {filteredProducts.length} high-fidelity customizable printing and packaging products
        </p>
      </div>

      {/* Mobile Filters Toggle Bar */}
      <div className="lg:hidden mb-6 flex items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100 hover:text-brand-900 dark:hover:text-gold-300 transition"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-800 dark:text-gold-400" />
          <span>{mobileFiltersOpen ? 'Hide Filters & Refinements' : 'Show Filters & Refinements'}</span>
          {mobileFiltersOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          {(selectedCategory !== 'all' || search || selectedShape !== 'all' || maxPrice < 1000 || onlyInStock) && (
            <span className="w-2 h-2 rounded-full bg-brand-800 dark:bg-gold-500 animate-pulse" />
          )}
        </button>

        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          {filteredProducts.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar (Collapsible on Mobile) */}
        <div className={`lg:col-span-1 space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100 font-display">
                <SlidersHorizontal className="w-4 h-4 text-brand-800 dark:text-gold-400" />
                <span>Filters & Refinements</span>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Stickers, boxes, pouch"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs outline-none focus:border-brand-600 dark:focus:border-gold-500 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                Categories
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === cat.slug
                        ? 'bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 font-bold'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider">
                  Max Unit Price
                </label>
                <span className="text-xs font-bold text-brand-900 dark:text-gold-400">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-800 dark:accent-gold-500"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹50</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* Shape Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-2">
                Available Shape
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedShape('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    selectedShape === 'all'
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  All
                </button>
                {shapesList.map((shp) => (
                  <button
                    key={shp}
                    onClick={() => setSelectedShape(shp)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition ${
                      selectedShape === shp
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {shp}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock toggle */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">In Stock Only</span>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-brand-800 dark:accent-gold-500 rounded cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Products Grid & Sorting Header */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting Bar */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Showing <strong className="text-stone-900 dark:text-stone-100">{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-600 dark:text-stone-300 font-semibold whitespace-nowrap">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200 outline-none focus:border-brand-600 dark:focus:border-gold-500 bg-white dark:bg-stone-800"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-display">No products found</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                We couldn't find any products matching your active filters. Try adjusting your search query or price limit.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const discountedPrice = prod.price * (1 - prod.discountPercent / 100)
                const img = prod.images[0]?.url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'

                return (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <Link
                      href={`/products/${prod.slug}`}
                      className="aspect-square bg-stone-100 dark:bg-stone-800 block relative overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {prod.discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                          {prod.discountPercent}% OFF
                        </span>
                      )}
                    </Link>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                          <span className="font-semibold text-brand-800 dark:text-gold-400">{prod.category?.name}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{prod.rating.toFixed(1)}</span>
                            <span className="text-stone-400 dark:text-stone-500 font-normal">({prod.reviewCount})</span>
                          </div>
                        </div>

                        <Link href={`/products/${prod.slug}`}>
                          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-2 group-hover:text-brand-900 dark:group-hover:text-gold-400 transition font-display">
                            {prod.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <div>
                          {prod.discountPercent > 0 && (
                            <span className="text-[10px] text-stone-400 line-through">
                              ₹{prod.price.toFixed(0)}
                            </span>
                          )}
                          <div className="text-base font-black text-stone-900 dark:text-stone-100">
                            ₹{discountedPrice.toFixed(0)}
                            <span className="text-[10px] font-normal text-stone-500 dark:text-stone-400 ml-1">/ unit</span>
                          </div>
                        </div>

                        <Link
                          href={`/products/${prod.slug}`}
                          className="px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                        >
                          <span>Customize</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

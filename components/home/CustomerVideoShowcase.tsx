'use client'

import React, { useState } from 'react'
import {
  Play,
  Pause,
  CheckCircle2,
  Instagram,
  Sparkles,
  Star,
  Quote,
} from 'lucide-react'

const videos = [
  {
    id: 1,
    title: 'Unboxing Magnetic Rigid Boxes for Artisanal Candles',
    creator: '@aura.botanicals',
    name: 'Aura Botanicals',
    thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    quote: 'The gold foil stamping and soft-touch matte feels extraordinary! Our clients love the unboxing experience.',
    duration: '0:38',
  },
  {
    id: 2,
    title: 'Peeling Waterproof Die-Cut Vinyl Stickers',
    creator: '@roastandbrew',
    name: 'Roast & Brew Coffee',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    quote: 'Completely dishwasher proof and waterproof. Survived over 50 wash cycles on our cold brew bottles without peeling!',
    duration: '0:24',
  },
  {
    id: 3,
    title: 'Iridescent Holographic Streetwear Sticker Drop',
    creator: '@hyperflux.apparel',
    name: 'HyperFlux Clothing',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    quote: 'The rainbow color shifts when sunlight hits it. Included 2 in every hoodie package and customers are raving.',
    duration: '0:45',
  },
  {
    id: 4,
    title: 'Corporate Employee Welcome Kit Unveiling',
    creator: '@zenithfintech',
    name: 'Zenith FinTech Labs',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    quote: '350 onboard welcome kits delivered across 18 cities without a single damaged box. Kagzify made us look like stars.',
    duration: '0:52',
  },
]

export default function CustomerVideoShowcase() {
  const [playingId, setPlayingId] = useState<number | null>(null)

  return (
    <section className="py-20 bg-stone-950 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider inline-block mb-3">
              🎥 In Real Life (IRL)
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white">
              Watch Real Customer Unboxings
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              See how modern founders, D2C teams, and creators showcase their Kagzify creations in the wild.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Tag us on Instagram</span>
            <strong className="text-gold-300 font-semibold">#KagzifyUnboxing</strong>
          </div>
        </div>

        {/* 4 Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="group relative bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 flex flex-col justify-between hover:border-gold-400/50 transition-all duration-300 shadow-xl"
            >
              {/* Thumbnail with Reel Aspect Ratio */}
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-stone-950">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-stone-300">
                  {vid.duration}
                </div>

                {/* Interactive Play Button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setPlayingId(playingId === vid.id ? null : vid.id)}
                    className="w-14 h-14 rounded-full bg-gold-400/90 hover:bg-gold-400 text-stone-950 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110"
                    aria-label="Play unboxing video"
                  >
                    {playingId === vid.id ? (
                      <Pause className="w-6 h-6 fill-stone-950 text-stone-950" />
                    ) : (
                      <Play className="w-6 h-6 fill-stone-950 text-stone-950 ml-1" />
                    )}
                  </button>
                </div>

                {/* Simulated playing notification */}
                {playingId === vid.id && (
                  <div className="absolute bottom-3 left-3 right-3 bg-brand-900/90 backdrop-blur-md border border-brand-500/40 p-2.5 rounded-xl text-center text-xs text-white animate-in fade-in">
                    ▶️ Streaming reel demonstration...
                  </div>
                )}
              </div>

              {/* Creator & Quote Footer */}
              <div className="p-4 bg-stone-900 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Brand Order</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 font-display">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-2 line-clamp-2 italic">
                    "{vid.quote}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium">{vid.name}</span>
                  <span className="text-stone-500 text-[10px]">{vid.creator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

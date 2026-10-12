import React from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react'

export const metadata = {
  title: 'Custom Printing & Packaging Guides | Kagzify Studio Blog',
  description: 'Technical prepress guides, sticker material selection, rigid box unboxing tips, and packaging trends.',
}

const posts = [
  {
    id: 1,
    title: 'Die-Cut vs. Kiss-Cut Stickers: The Definitive Brand Guide',
    snippet: 'Discover the key differences between custom contour die-cut individual peel stickers and kiss-cut sticker sheets, plus which offers superior ROI for giveaways and e-commerce packaging inserts.',
    category: 'Stickers & Labels',
    readTime: '4 min read',
    date: 'Oct 2026',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    slug: 'die-cut-vs-kiss-cut-stickers',
  },
  {
    id: 2,
    title: 'The Anatomy of a 1200 GSM Luxury Magnetic Rigid Box',
    snippet: 'Why heavyweight greyboard combined with soft-touch matte lamination and hidden neodymium magnet closures triggers dopamine and boosts perceived product value by up to 300%.',
    category: 'Packaging Engineering',
    readTime: '6 min read',
    date: 'Oct 2026',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    slug: 'luxury-magnetic-rigid-boxes-guide',
  },
  {
    id: 3,
    title: 'How to Prepare CMYK Artwork with Zero Bleed Errors',
    snippet: 'A step-by-step pre-flight checklist for graphic designers: vector cut-lines, Pantone color translation, minimum stroke weights, and safe margin zones.',
    category: 'Design & Prepress',
    readTime: '5 min read',
    date: 'Sep 2026',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    slug: 'cmyk-bleed-lines-prepress-guide',
  },
  {
    id: 4,
    title: 'Sustainable Barrier Pouches: Food-Grade Packaging Demystified',
    snippet: 'How multi-layer virgin kraft paper laminated with biodegradable barrier films keeps specialty coffee beans and artisanal snacks fresh without toxic plasticizers.',
    category: 'Eco Packaging',
    readTime: '5 min read',
    date: 'Sep 2026',
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=600&q=80',
    slug: 'eco-kraft-barrier-pouches-explained',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-paper-50 dark:bg-stone-950 min-h-screen py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-gold-950/40 text-brand-900 dark:text-gold-400 border border-transparent dark:border-gold-800/60 text-xs font-bold uppercase tracking-wider inline-block mb-2">
            Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
            Printing & Packaging Guides
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2">
            Master material selections, artwork prep, and packaging engineering with our studio insights.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                    <span className="font-semibold text-brand-800 dark:text-gold-400 bg-brand-50 dark:bg-gold-950/40 px-2.5 py-0.5 rounded-full border border-brand-100 dark:border-gold-800/60">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-display group-hover:text-brand-900 dark:group-hover:text-gold-400 transition">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                    {post.snippet}
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-100 dark:border-stone-800 mt-6 flex items-center justify-between">
                  <span className="text-xs text-stone-400 dark:text-stone-500">{post.date}</span>
                  <Link
                    href={`/products`}
                    className="text-xs font-bold text-brand-900 dark:text-gold-400 flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}

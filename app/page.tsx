import { prisma } from '@/lib/prisma'
import HeroSlideshow from '@/components/home/HeroSlideshow'
import DiscountedDeals from '@/components/home/DiscountedDeals'
import TabbedProductShowcase from '@/components/home/TabbedProductShowcase'
import CategoryGrid from '@/components/home/CategoryGrid'
import PopularPicksBento from '@/components/home/PopularPicksBento'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import IndustrySection from '@/components/home/IndustrySection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import HowItWorks from '@/components/home/HowItWorks'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CustomerVideoShowcase from '@/components/home/CustomerVideoShowcase'
import PersonalImageUploadSection from '@/components/home/PersonalImageUploadSection'
import FaqAccordion from '@/components/home/FaqAccordion'

export const revalidate = 0 // Dynamic data loading

export default async function HomePage() {
  // Fetch real seeded data from Prisma
  const [products, heroSlides, testimonials, faqs] = await Promise.all([
    prisma.product.findMany({
      include: {
        images: true,
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    }),
    prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    }),
  ])

  // Transform hero slides
  const formattedSlides = heroSlides.map((s) => ({
    id: s.id,
    badge: s.badge || '✨ Studio Custom Print',
    title: s.title,
    subtitle: s.subtitle,
    ctaText: s.ctaText,
    ctaLink: s.ctaLink,
    secondaryCtaText: s.secondaryCtaText || undefined,
    secondaryCtaLink: s.secondaryCtaLink || undefined,
    imageUrl: s.imageUrl,
    gradient: s.bgGradient || 'from-stone-950/90 via-stone-900/80 to-transparent',
  }))

  const featuredProducts = products.filter((p) => p.isFeatured)

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Slideshow */}
      <HeroSlideshow slides={formattedSlides.length > 0 ? formattedSlides : undefined} />

      {/* 2. Discounted Deals with Flash Timer */}
      <DiscountedDeals products={products} />

      {/* 3. "What Are You Printing Today?" Category Grid */}
      <CategoryGrid />

      {/* 4. Tabbed Product Showcase (Bestseller, Packaging, Corporate Gifts, Gallery) */}
      <TabbedProductShowcase products={products} />

      {/* 5. "Popular Picks" Bento Grid */}
      <PopularPicksBento />

      {/* 6. Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts.length > 0 ? featuredProducts : products} />

      {/* 7. "Custom Print For Every Industry" */}
      <IndustrySection />

      {/* 8. "Why Choose Us" Pillars */}
      <WhyChooseUs />

      {/* 9. "How It Works" 4 Steps */}
      <HowItWorks />

      {/* 10. Client Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 11. Customer Video Unboxing Carousel */}
      <CustomerVideoShowcase />

      {/* 12. Personal Image / Custom Order Rapid Quote Section */}
      <PersonalImageUploadSection />

      {/* 13. Frequently Asked Questions Accordion */}
      <FaqAccordion faqs={faqs} />
    </div>
  )
}

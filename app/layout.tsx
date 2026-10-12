import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Kagzify Studio | Bespoke Custom Printing, Packaging & Corporate Gifting',
  description: 'India’s premier digital custom printing and packaging studio. Die-cut waterproof vinyl stickers, luxury magnetic rigid boxes, stand-up pouches, mailers, and corporate gifting kits with live shape masking.',
  keywords: 'custom stickers, packaging boxes, die cut vinyl, corporate gifting, poly mailers, custom printing India, bespoke packaging',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-paper-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-brand-900 selection:text-gold-300 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


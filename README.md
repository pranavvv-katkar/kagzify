# 🌟 Kagzify Studio — Custom Printing, Packaging & Corporate Gifting Platform

> A full-stack, multi-page e-commerce application engineered for short-run digital custom printing, luxury rigid packaging, and corporate gifting. Features an **interactive real-time sticker shape customizer**, customer artwork proofing, personal image quote requests, and an executive administration console.

---

## 🚀 Key Features

### 1. Interactive Real-Time Sticker Shape Customizer
- **Dynamic Shape Masking**: Switch between **Circle, Rectangle, Hexagon, Triangle, Heart, Square, and Organic Die-Cut** contours with real-time CSS clip-paths and SVG masks.
- **Artwork Canvas**: Drag, zoom (50% to 300%), pan, and align artwork with bleed safe-zone guidelines.
- **Substrate & Finish Configurator**: Choose materials (*Glossy Vinyl, Matte White, Holographic Rainbow Prism, Kraft Paper, Clear Transparent*) and protective laminates (*UV Gloss, Soft-Touch Matte, Hot Gold Foil*).
- **Dynamic Live Pricing Engine**: Real-time price updates considering dimensions, material add-ons, and volume discount tiers (up to 45% off on 1000+ pcs).
- **Artwork Preservation**: Chosen shape mask and customer uploaded artwork are saved directly with the order item and can be downloaded by admin operators.

### 2. Personal Image / Custom Order Section (`/custom-order` & Homepage)
- Customers upload personal photographs, 3D renders, or packaging mock-ups for unlisted items (e.g., custom engraved mugs, apparel, bespoke hamper boxes).
- Specify custom dimensions, target quantities, and finish preferences.
- Direct inbox in the Admin Dashboard where operators review files, calculate quotes, and respond with official price estimates.

### 3. Public Storefront Pages (Kagzify Architecture)
- **Home (`/`)**:
  - Announcement bar with discount code (`FIRST10`), WhatsApp, and Instagram links.
  - Hero slideshow with smooth auto-play transitions and bullet trust highlights.
  - Limited-time discounted deals with countdown timer and star ratings.
  - Tabbed showcase (*Bestsellers, Packaging & Boxes, Corporate Gifts, Inspiration Gallery*).
  - *"What are you printing today?"* 8-item visual category grid.
  - *"Popular picks"* asymmetric Bento Grid.
  - Horizontal scrolling featured products carousel.
  - *"Custom print for every industry"* interactive selector (*Food & Beverage, Retail, Tech, Cosmetics, Events*).
  - *"Why choose us"* 6 pillars (zero setup fees, 48h dispatch, low MOQs, file proofing).
  - *"How it works"* 4-step ordering guide.
  - Client testimonials with verified buyer badges.
  - Customer video / reel unboxing carousel.
  - FAQ accordion with WhatsApp support card.
  - Newsletter discount capture (10% off).
  - Comprehensive 5-column luxury footer.
- **Collections & All Products (`/products`)**:
  - Dynamic filtering by category, price slider (₹50 - ₹1000), shape, and in-stock items.
  - Live sorting (Featured, Price Low-High, Price High-Low, Highest Rated).
  - Full-text instant search.
- **Product Detail & Customizer (`/products/[slug]`)**:
  - High-res image gallery, volume pricing tiers, technical specifications, and customizer.
- **Cart & Slide-Over Drawer (`/cart`)**:
  - Free shipping progress bar (threshold ₹999), coupon input (`FIRST10`, `LUXE20`), item specification pills, and quantity adjusters.
- **Checkout (`/checkout`)**:
  - Shipping address capture, simulated instant UPI / QR code payment, Card, Net Banking, and Bank Transfer with 256-bit SSL verification.
- **Order Success (`/order-success/[orderNumber]`)**:
  - Confirmation reference, 4-phase production timeline tracker, item list, and address summary.
- **Information & Policy Pages**:
  - `/about`: Studio story, digital press facility, FSC eco-responsibility.
  - `/contact`: Interactive form, physical studio address in New Delhi, direct WhatsApp chat.
  - `/blog`: Printing guides on bleed lines, 1200 GSM rigid boxes, and die-cut vs kiss-cut stickers.
  - `/privacy`, `/terms`, `/shipping`: Full commercial e-commerce policy terms.

### 4. Role-Based Authentication & Portals
- **Customer Portal (`/account`)**:
  - Order history with tracking numbers and shape previews.
  - Custom quote request inbox with admin reply notes and price quotes.
  - Saved delivery addresses and profile details.
  - Public registration strictly creates `CUSTOMER` accounts.
- **Admin Portal (`/admin/login` & `/admin`)**:
  - Security-isolated staff login route (admin accounts can never be created via public signup).
  - **Overview**: Revenue today/week/month/total, order volume, pending quotes, low-stock warnings, and top products.
  - **Financial Records**: Audited transaction register with CSV export (`Export to CSV`).
  - **Product Management**: Add, edit, delete products, manage prices, discounts, inventory, and shape availability.
  - **Stock Management & Logs**: Real-time stock counts, manual adjustment widgets, and automatic deduction whenever orders are placed, with complete `StockLog` audit trail.
  - **Order Management**: Order status updater (`PLACED`, `IN_PRODUCTION`, `SHIPPED`, `DELIVERED`, `CANCELLED`), tracking number assigner, and customer artwork download links.
  - **Custom Order Requests**: Review uploaded customer artwork, submit formal quote prices, and approve/reject.
  - **Homepage CMS**: Add and manage Hero Slides, FAQs, and Client Testimonials.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS with custom luxury palette, paper tones, sticker peel animations, and CSS clip-paths
- **Database & ORM**: Prisma ORM with SQLite (zero-config local dev default) and drop-in PostgreSQL support
- **Authentication**: JWT token handling with secure HTTP-only cookies and bcryptjs password hashing
- **Icons**: Lucide React
- **File Uploads**: Native App Router Multipart API (`/api/upload`) saving to `public/uploads/`

---

## 📦 Setup & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file (an example `.env.example` is provided):
```env
# Default zero-setup SQLite database:
DATABASE_URL="file:./dev.db"

# Or if you have a local or remote PostgreSQL instance:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kagzify_db?schema=public"

JWT_SECRET="kagzify_super_secret_jwt_key_99214"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_INITIAL_EMAIL="admin@kagzify.com"
ADMIN_INITIAL_PASSWORD="AdminPassword123!"
```

### 3. Initialize & Seed Database
```bash
# Push schema to SQLite:
npx prisma db push

# Seed sample products, categories, hero slides, reviews, and admin account:
node prisma/seed.js
```

*(Note for PostgreSQL: To use PostgreSQL instead, update `provider = "postgresql"` in `prisma/schema.prisma` or push via `npx prisma db push --schema=prisma/schema.postgresql.prisma`)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo & Admin Credentials

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| **Master Admin** | [`/admin/login`](http://localhost:3000/admin/login) | `admin@kagzify.com` | `AdminPassword123!` |
| **Sample Customer** | [`/auth/login`](http://localhost:3000/auth/login) | `priya@example.com` | `CustomerPassword123!` |

*Both login screens feature one-click demo credential filler buttons for rapid testing.*

---

## 🏷️ Test Promotional Coupons

Enter these in the Cart slide-over drawer or Cart page:
- `FIRST10` — 10% discount on order subtotal
- `LUXE20` — 20% discount on order subtotal
- Orders over ₹999 automatically qualify for **Free Express Shipping**.

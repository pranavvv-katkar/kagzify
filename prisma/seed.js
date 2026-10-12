const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Kagzify database seeding...')

  // Clean existing tables (in safe relational order)
  try {
    await prisma.stockLog.deleteMany()
    await prisma.customRequest.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.variant.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.address.deleteMany()
    await prisma.testimonial.deleteMany()
    await prisma.fAQ.deleteMany()
    await prisma.heroSlide.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {
    console.log('Clean table notice:', e.message)
  }

  // 1. Create Admin User
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Kagzify Admin Team',
      email: 'admin@kagzify.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // 2. Create Sample Customer
  const customerPasswordHash = await bcrypt.hash('CustomerPassword123!', 10)
  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: '+91 91234 56789',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      addresses: {
        create: {
          fullName: 'Priya Sharma',
          phone: '+91 91234 56789',
          street: 'Flat 402, Lotus Orchid, Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true,
        },
      },
    },
  })
  console.log('✅ Sample customer created:', customer.email)

  // 3. Categories
  const categoriesData = [
    {
      name: 'Custom Stickers & Labels',
      slug: 'stickers-labels',
      description: 'Die-cut, kiss-cut, holographic and waterproof roll labels tailored to any shape.',
      icon: 'Sticker',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    },
    {
      name: 'Rigid Boxes & Packaging',
      slug: 'packaging-boxes',
      description: 'Luxury magnetic boxes, corrugated mailers, and folding cartons with premium finishes.',
      icon: 'Package',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    },
    {
      name: 'Corporate Gifting & Merch',
      slug: 'corporate-gifting',
      description: 'Curated welcome kits, custom drinkware, premium stationery, and branded apparel.',
      icon: 'Gift',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    },
    {
      name: 'Bags & Shipping Mailers',
      slug: 'bags-mailers',
      description: 'Eco kraft paper shopping bags, printed poly mailers, and padded bubble envelopes.',
      icon: 'ShoppingBag',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    },
    {
      name: 'Marketing Stationery & Cards',
      slug: 'stationery-marketing',
      description: 'Luxury foiled business cards, product inserts, brochures, and embossed certificates.',
      icon: 'Printer',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      displayOrder: 5,
    },
    {
      name: 'Custom Drinkware & Bottles',
      slug: 'drinkware-bottles',
      description: 'Vacuum insulated thermos bottles, ceramic mugs, and reusable tumblers with laser etching.',
      icon: 'Coffee',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      displayOrder: 6,
    },
  ]

  const categories = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat })
    categories[cat.slug] = created
  }
  console.log('✅ Categories created')

  // 4. Products
  const productsData = [
    {
      title: 'Precision Die-Cut Vinyl Stickers',
      slug: 'die-cut-vinyl-stickers',
      description: 'Thick, ultra-durable vinyl that protects your stickers from scratches, water, and direct sunlight. Precision laser contour cutting precisely traces the edge of your design in any shape—circle, rectangle, hexagon, heart, or custom organic contour.',
      shortDescription: 'Waterproof, scratch-resistant custom stickers cut to any shape with precision peel.',
      price: 199.00,
      discountPercent: 15,
      baseStock: 2500,
      isFeatured: true,
      isBestseller: true,
      categoryId: categories['stickers-labels'].id,
      availableShapes: 'circle,rectangle,hexagon,triangle,heart,square,diecut',
      minQuantity: 50,
      isCustomizable: true,
      rating: 4.96,
      reviewCount: 230,
      images: [
        { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80', isPrimary: false, order: 1 },
      ],
      variants: [
        { name: '2x2 inch / Glossy Vinyl (100 pcs)', size: '2x2 inch', material: 'Glossy Vinyl', finish: 'UV Gloss', quantity: 100, priceAdjustment: 0, stock: 500 },
        { name: '3x3 inch / Glossy Vinyl (100 pcs)', size: '3x3 inch', material: 'Glossy Vinyl', finish: 'UV Gloss', quantity: 100, priceAdjustment: 80, stock: 450 },
        { name: '3x3 inch / Matte Vinyl (250 pcs)', size: '3x3 inch', material: 'Matte Vinyl', finish: 'Soft Touch Matte', quantity: 250, priceAdjustment: 220, stock: 300 },
      ]
    },
    {
      title: 'Holographic Prism Foil Stickers',
      slug: 'holographic-stickers',
      description: 'Turn your logo or artwork into a shimmering spectacle. Our iridescent holographic film creates a rainbow color shift effect under varying light angles, finished with an ultra-protective glossy top coat.',
      shortDescription: 'Iridescent metallic shimmer vinyl stickers with vibrant color shifts and heavy-duty adhesive.',
      price: 289.00,
      discountPercent: 10,
      baseStock: 1800,
      isFeatured: true,
      isBestseller: false,
      categoryId: categories['stickers-labels'].id,
      availableShapes: 'circle,rectangle,hexagon,heart,square',
      minQuantity: 50,
      isCustomizable: true,
      rating: 4.92,
      reviewCount: 94,
      images: [
        { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', isPrimary: false, order: 1 },
      ],
      variants: [
        { name: '2x2 inch / Holographic (50 pcs)', size: '2x2 inch', material: 'Holographic Prism', finish: 'Gloss Laminated', quantity: 50, priceAdjustment: 0, stock: 300 },
        { name: '3x3 inch / Holographic (100 pcs)', size: '3x3 inch', material: 'Holographic Prism', finish: 'Gloss Laminated', quantity: 100, priceAdjustment: 120, stock: 250 },
      ]
    },
    {
      title: 'Luxury Magnetic Closure Rigid Box',
      slug: 'magnetic-closure-rigid-box',
      description: 'Elevate your product presentation to the highest tier. Handcrafted with rigid 1200 GSM recycled greyboard, lined with smooth art paper, and featuring hidden magnetic snaps that close with a satisfying click.',
      shortDescription: 'Opulent rigid presentation gift box with concealed magnetic clasps and bespoke foil logo.',
      price: 389.00,
      discountPercent: 20,
      baseStock: 800,
      isFeatured: true,
      isBestseller: true,
      isPackaging: true,
      categoryId: categories['packaging-boxes'].id,
      availableShapes: 'rectangle,square',
      minQuantity: 25,
      isCustomizable: true,
      rating: 4.98,
      reviewCount: 112,
      images: [
        { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80', isPrimary: false, order: 1 },
      ],
      variants: [
        { name: 'Medium (8x6x3 inch) / Black Matte', size: 'Medium', material: '1200 GSM Board', finish: 'Soft Touch Matte', quantity: 25, priceAdjustment: 0, stock: 150 },
        { name: 'Large (12x9x4 inch) / Gold Foil Stamped', size: 'Large', material: '1400 GSM Board', finish: 'Gold Foil Stamped', quantity: 25, priceAdjustment: 150, stock: 120 },
      ]
    },
    {
      title: 'Eco Kraft Stand-Up Pouches with Airtight Zip',
      slug: 'eco-kraft-stand-up-pouches',
      description: 'Biodegradable yet heavy-duty multi-layer barrier pouches. Keeps coffees, spices, organic snacks, or bath salts fresh. Features an easy-tear notch, rounded corners, and a crystal clear viewing window option.',
      shortDescription: 'Multi-layer kraft paper barrier pouches with resealable airtight zipper and heat-seal band.',
      price: 139.00,
      discountPercent: 12,
      baseStock: 3500,
      isFeatured: false,
      isBestseller: false,
      isPackaging: true,
      categoryId: categories['packaging-boxes'].id,
      availableShapes: 'rectangle',
      minQuantity: 100,
      isCustomizable: true,
      rating: 4.88,
      reviewCount: 78,
      images: [
        { url: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
      ],
      variants: [
        { name: '250g (13x20 cm) / 100 pcs', size: '250g', material: 'Virgin Kraft + Foil Liner', finish: 'Natural Matte', quantity: 100, priceAdjustment: 0, stock: 600 },
        { name: '500g (16x24 cm) / 250 pcs', size: '500g', material: 'Virgin Kraft + Foil Liner', finish: 'Natural Matte', quantity: 250, priceAdjustment: 180, stock: 400 },
      ]
    },
    {
      title: 'Custom Printed E-Commerce Poly Mailers',
      slug: 'custom-poly-mailers',
      description: 'Waterproof, puncture-resistant 60-micron LDPE courier mailers customized with your full exterior brand livery. Equipped with tamper-evident dual peel-and-seal strips for seamless customer returns.',
      shortDescription: 'Tear-proof waterproof shipping courier bags with tamper-evident double adhesive strip.',
      price: 99.00,
      discountPercent: 15,
      baseStock: 5000,
      isFeatured: false,
      isBestseller: true,
      isPackaging: true,
      categoryId: categories['bags-mailers'].id,
      availableShapes: 'rectangle',
      minQuantity: 100,
      isCustomizable: true,
      rating: 4.91,
      reviewCount: 165,
      images: [
        { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
      ],
      variants: [
        { name: '10x13 inch / 100 pcs', size: '10x13 inch', material: 'Recycled LDPE', finish: 'Matte Finish', quantity: 100, priceAdjustment: 0, stock: 1200 },
        { name: '14x19 inch / 250 pcs', size: '14x19 inch', material: 'Recycled LDPE', finish: 'Matte Finish', quantity: 250, priceAdjustment: 210, stock: 800 },
      ]
    },
    {
      title: 'Executive Vegan Leather Planner & Engraved Pen Kit',
      slug: 'executive-planner-gift-set',
      description: 'The definitive corporate onboarding and executive milestone gift. Includes an Italian PU leather hardbound diary with ribbon bookmark, accompanied by an aircraft-grade aluminum rollerball pen crisply laser-engraved with each recipient name.',
      shortDescription: 'Hand-stitched vegan leather diary paired with laser-engraved rollerball pen in a debossed presentation sleeve.',
      price: 749.00,
      discountPercent: 25,
      baseStock: 650,
      isFeatured: true,
      isBestseller: true,
      isCorporateGift: true,
      categoryId: categories['corporate-gifting'].id,
      availableShapes: 'rectangle',
      minQuantity: 10,
      isCustomizable: true,
      rating: 4.97,
      reviewCount: 88,
      images: [
        { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', isPrimary: false, order: 1 },
      ],
      variants: [
        { name: 'Midnight Black / Gold Engraving', size: 'A5 Notebook + Pen', material: 'Italian Vegan Leather', finish: 'Gold Debossed', quantity: 10, priceAdjustment: 0, stock: 200 },
        { name: 'Forest Green / Silver Engraving', size: 'A5 Notebook + Pen', material: 'Italian Vegan Leather', finish: 'Silver Debossed', quantity: 10, priceAdjustment: 0, stock: 180 },
      ]
    },
    {
      title: 'Matte Double-Wall Stainless Steel Tumbler (500ml)',
      slug: 'insulated-steel-tumbler',
      description: 'Engineered with double-wall copper vacuum insulation that keeps cold drinks chilled for 24 hours and hot coffee steaming for 12 hours. Sweat-free powder-coat finish with 360-degree rotary UV direct print or precision laser engraving.',
      shortDescription: 'Powder-coated 304 stainless steel tumbler with spill-proof lid and scratch-resistant rotary imprint.',
      price: 499.00,
      discountPercent: 18,
      baseStock: 900,
      isFeatured: false,
      isBestseller: true,
      isCorporateGift: true,
      categoryId: categories['drinkware-bottles'].id,
      availableShapes: 'circle,rectangle',
      minQuantity: 15,
      isCustomizable: true,
      rating: 4.89,
      reviewCount: 142,
      images: [
        { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
      ],
      variants: [
        { name: 'Matte Black (15 pcs)', size: '500ml', material: '304 Stainless Steel', finish: 'Laser Engraved', quantity: 15, priceAdjustment: 0, stock: 220 },
        { name: 'Arctic White (25 pcs)', size: '500ml', material: '304 Stainless Steel', finish: 'UV Color Print', quantity: 25, priceAdjustment: 90, stock: 190 },
      ]
    },
    {
      title: 'Embossed Cotton Business Cards (600 GSM)',
      slug: 'embossed-cotton-business-cards',
      description: 'Crafted on ultra-heavyweight 100% pure cotton paper with a rich tactile tooth. Combined with deep blind debossing, metallic hot foil stamping, and colored painted edges for an unmistakable prestige finish.',
      shortDescription: 'Extra-thick 600 GSM cotton letterpress business cards with hand-finished metallic foil edges.',
      price: 449.00,
      discountPercent: 10,
      baseStock: 1200,
      isFeatured: true,
      isBestseller: false,
      categoryId: categories['stationery-marketing'].id,
      availableShapes: 'rectangle,square',
      minQuantity: 100,
      isCustomizable: true,
      rating: 4.98,
      reviewCount: 95,
      images: [
        { url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80', isPrimary: true, order: 0 },
      ],
      variants: [
        { name: '3.5x2 inch / Gold Foil (100 pcs)', size: 'Standard 3.5x2 inch', material: '600 GSM Cotton Card', finish: 'Hot Gold Foil + Edge Gilding', quantity: 100, priceAdjustment: 0, stock: 400 },
        { name: '3.5x2 inch / Rose Gold (250 pcs)', size: 'Standard 3.5x2 inch', material: '600 GSM Cotton Card', finish: 'Rose Gold Foil', quantity: 250, priceAdjustment: 260, stock: 350 },
      ]
    },
  ]

  const createdProducts = []
  for (const prodData of productsData) {
    const { images, variants, ...prodFields } = prodData
    const product = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
      },
    })
    createdProducts.push(product)
  }
  console.log(`✅ Created ${createdProducts.length} rich products with variants and image galleries`)

  // 5. Hero Slides
  const heroSlides = [
    {
      badge: '✨ Bespoke Production & Zero Setup Fees',
      title: 'Custom Printing & Luxury Packaging for Modern Brands',
      subtitle: 'From pixel-perfect vinyl stickers in any shape to rigid magnetic gift boxes and employee welcome kits. Crafted with precision, shipped in 48 hours.',
      ctaText: 'Explore Collections',
      ctaLink: '/products',
      secondaryCtaText: 'Customize Stickers',
      secondaryCtaLink: '/products/die-cut-vinyl-stickers',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
      bgGradient: 'from-brand-950 via-brand-900 to-slate-900',
      active: true,
      order: 1,
    },
    {
      badge: '🏷️ Instant Real-Time Shape Masking',
      title: 'Precision Die-Cut Stickers in Any Shape You Dream',
      subtitle: 'Upload your artwork and watch it magically re-mask to circles, hexagons, hearts, or organic contours with live 3D preview and instant price calculation.',
      ctaText: 'Launch Sticker Customizer',
      ctaLink: '/products/die-cut-vinyl-stickers',
      secondaryCtaText: 'Request Custom Quote',
      secondaryCtaLink: '/custom-order',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
      bgGradient: 'from-amber-950 via-brand-950 to-stone-900',
      active: true,
      order: 2,
    },
    {
      badge: '🎁 Unforgettable Employee & Client Moments',
      title: 'Curated Corporate Gifting & Executive Merchandise',
      subtitle: 'Luxury unboxing experiences featuring engraved drinkware, embossed leather stationery, and bespoke branded kits delivered direct to doorsteps.',
      ctaText: 'Corporate Gifting Suite',
      ctaLink: '/products?category=corporate-gifting',
      secondaryCtaText: 'Bulk Order Inquiry',
      secondaryCtaLink: '/custom-order',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
      bgGradient: 'from-emerald-950 via-slate-900 to-brand-950',
      active: true,
      order: 3,
    },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide })
  }
  console.log('✅ Hero slides created')

  // 6. Testimonials
  const testimonials = [
    {
      customerName: 'Aarav Mehta',
      company: 'Roast & Brew Artisan Coffee',
      role: 'Founder & Head of Brand',
      rating: 5,
      comment: 'Kagzify transformed our whole customer unboxing experience. The custom matte kraft pouches and embossed stickers look like they belong in a Michelin star boutique. The 48-hour turn-around is unmatched.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
    },
    {
      customerName: 'Sanya Sengupta',
      company: 'Lumière Skincare & Organics',
      role: 'Creative Director',
      rating: 5,
      comment: 'The live sticker customizer made designing our cosmetic jar labels effortless. Seeing the real-time hexagon mask and ordering our exact quantity without rigid high MOQs saved us weeks.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
    },
    {
      customerName: 'Vikramaditya Roy',
      company: 'Zenith FinTech Labs',
      role: 'VP People & Culture',
      rating: 5,
      comment: 'We ordered 350 custom executive welcome boxes with engraved tumblers and vegan leather journals for our global annual summit. Every single box arrived pristine and our employees were thoroughly wowed.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
    },
    {
      customerName: 'Neha Deshmukh',
      company: 'Urban Flora Boutiques',
      role: 'Retail Merchandiser',
      rating: 5,
      comment: 'Their hot-foiled rigid boxes with magnetic clasps are gorgeous! Our luxury candle collection sold out twice as fast because the packaging makes it an instant premium gift.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }
  console.log('✅ Testimonials created')

  // 7. FAQs
  const faqs = [
    {
      question: 'What file formats can I upload for custom printing and stickers?',
      answer: 'We accept vector files including SVG, AI, EPS, and PDF for optimal razor-sharp print quality, as well as high-resolution raster files (PNG, JPG, TIFF) at 300 DPI or higher. Our live customizer automatically checks file fidelity and offers instant shape clipping.',
      category: 'Artwork & Customizer',
      order: 1,
    },
    {
      question: 'What is your minimum order quantity (MOQ)?',
      answer: 'Unlike traditional industrial print houses that require thousands of units, our digital short-run printing starts as low as 10 to 50 pieces for stickers, mailers, and custom drinkware, and 25 units for rigid luxury gift boxes. Scale seamlessly as your business grows.',
      category: 'Ordering & Pricing',
      order: 2,
    },
    {
      question: 'How fast will my order be produced and delivered?',
      answer: 'Standard digital custom printing ships within 48 to 72 business hours after artwork proof approval. Luxury rigid packaging and large-volume orders typically dispatch in 5-7 business days. Express express shipping is available across all pin codes.',
      category: 'Shipping & Delivery',
      order: 3,
    },
    {
      question: 'Are your vinyl stickers truly waterproof and weather-resistant?',
      answer: 'Yes! Our die-cut vinyl stickers feature premium thick vinyl film and a UV-inhibiting laminate overcoat. They resist heavy rain, intense sunlight, oil, scratch marks, and are completely dishwasher-safe.',
      category: 'Materials & Durability',
      order: 4,
    },
    {
      question: 'Can I request a sample kit or a bespoke product not listed on the catalog?',
      answer: 'Absolutely. You can use our "Custom Order & Personal Image" section or dedicated page to upload any photograph or 3D mock-up, specify dimensions and materials, and our packaging engineers will reply with a detailed price quote within 4 business hours.',
      category: 'Custom Projects',
      order: 5,
    },
  ]

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f })
  }
  console.log('✅ FAQs created')

  // 8. Sample Customer Order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'KGZ-88241',
      userId: customer.id,
      guestEmail: customer.email,
      guestName: customer.name,
      guestPhone: customer.phone,
      status: 'IN_PRODUCTION',
      paymentStatus: 'PAID',
      subtotal: 588.00,
      discount: 50.00,
      shippingFee: 0.00,
      tax: 26.90,
      total: 564.90,
      shippingAddress: JSON.stringify({
        fullName: 'Priya Sharma',
        phone: '+91 91234 56789',
        street: 'Flat 402, Lotus Orchid, Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      }),
      trackingNumber: 'TRK-IND-902348',
      notes: 'Please pack in eco-protective bubble wrap.',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            title: 'Precision Die-Cut Vinyl Stickers',
            unitPrice: 199.00,
            quantity: 100,
            subtotal: 199.00,
            shape: 'circle',
            material: 'Glossy Vinyl',
            finish: 'UV Gloss',
            size: '3x3 inch',
            artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            croppedPreviewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            customNotes: 'Brand logo for artisanal coffee cups',
          },
          {
            productId: createdProducts[2].id,
            title: 'Luxury Magnetic Closure Rigid Box',
            unitPrice: 389.00,
            quantity: 25,
            subtotal: 389.00,
            shape: 'rectangle',
            material: '1200 GSM Board',
            finish: 'Soft Touch Matte',
            size: 'Medium (8x6x3 inch)',
            artworkUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
            customNotes: 'Gold foil on front lid center',
          },
        ],
      },
      payments: {
        create: {
          method: 'UPI',
          transactionId: 'UPI-TXN-9988214',
          amount: 564.90,
          status: 'COMPLETED',
        },
      },
    },
  })
  console.log('✅ Sample order created:', sampleOrder.orderNumber)

  // 9. Sample Custom Request
  await prisma.customRequest.create({
    data: {
      userId: customer.id,
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 91234 56789',
      productType: 'Bespoke Holographic Hardcover Gift Boxes',
      quantity: 50,
      dimensions: '10 x 8 x 4 inches',
      finishPreferences: 'Holographic rainbow hot stamping on matte deep green background',
      notes: 'Need this for our festive Diwali corporate launch. Would love a prototype sample if possible.',
      artworkUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      status: 'QUOTED',
      quoteAmount: 18500.00,
      quoteNotes: 'Prototype will be ready within 3 days. Unit cost INR 370 inclusive of GST and custom dies.',
    },
  })
  console.log('✅ Sample custom request created')

  console.log('🎉 Kagzify database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

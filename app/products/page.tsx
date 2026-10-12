import { prisma } from '@/lib/prisma'
import ProductsFilterView from '@/components/products/ProductsFilterView'

export const revalidate = 0

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string; search?: string }
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        images: true,
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ])

  return (
    <div className="bg-paper-50 dark:bg-stone-950 min-h-screen transition-colors">
      <ProductsFilterView
        initialProducts={products}
        categories={categories}
        initialCategory={searchParams?.category}
        initialSearch={searchParams?.search}
      />
    </div>
  )
}

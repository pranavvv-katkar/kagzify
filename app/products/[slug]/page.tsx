import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductCustomizerView from '@/components/product/ProductCustomizerView'

export const revalidate = 0

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
      variants: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-paper-50 dark:bg-stone-950 min-h-screen transition-colors">
      <ProductCustomizerView product={product} />
    </div>
  )
}

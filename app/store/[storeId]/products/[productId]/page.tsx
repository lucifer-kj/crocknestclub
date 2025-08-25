import { notFound } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { ProductDetail } from '@/components/storefront/product-detail'

interface ProductPageProps {
  params: {
    storeId: string
    productId: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prismadb.product.findFirst({
    where: {
      id: params.productId,
      storeId: params.storeId
    },
    include: {
      images: true,
      category: true,
      size: true,
      color: true
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} storeId={params.storeId} />
      </div>
    </div>
  )
}

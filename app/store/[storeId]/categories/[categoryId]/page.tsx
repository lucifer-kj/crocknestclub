import { notFound } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { ProductCard } from '@/components/storefront/product-card'

interface CategoryPageProps {
  params: {
    storeId: string
    categoryId: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prismadb.category.findFirst({
    where: {
      id: params.categoryId,
      storeId: params.storeId
    }
  })

  if (!category) {
    notFound()
  }

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      categoryId: params.categoryId,
      isArchived: false
    },
    include: {
      images: true,
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-gray-600">{products.length} products found</p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">This category is empty at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} storeId={params.storeId} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

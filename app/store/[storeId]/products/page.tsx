import { notFound } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { ProductCard } from '@/components/storefront/product-card'
import { ProductFilters } from '@/components/storefront/product-filters'

interface ProductsPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    category?: string
    color?: string
    size?: string
    featured?: string
    search?: string
  }
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const store = await prismadb.store.findUnique({
    where: {
      id: params.storeId
    }
  })

  if (!store) {
    notFound()
  }

  // Build where clause based on filters
  const whereClause: any = {
    storeId: params.storeId,
    isArchived: false
  }

  if (searchParams.category) {
    whereClause.categoryId = searchParams.category
  }

  if (searchParams.color) {
    whereClause.colorId = searchParams.color
  }

  if (searchParams.size) {
    whereClause.sizeId = searchParams.size
  }

  if (searchParams.featured === 'true') {
    whereClause.isFeatured = true
  }

  if (searchParams.search) {
    whereClause.name = {
      contains: searchParams.search,
      mode: 'insensitive'
    }
  }

  const products = await prismadb.product.findMany({
    where: whereClause,
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

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  })

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    }
  })

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  })

  const currentFilters = {
    category: searchParams.category || '',
    color: searchParams.color || '',
    size: searchParams.size || '',
    featured: searchParams.featured === 'true',
    search: searchParams.search || ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProductFilters
              categories={categories}
              colors={colors}
              sizes={sizes}
              currentFilters={currentFilters}
              storeId={params.storeId}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
              <p className="text-gray-600">{products.length} products found</p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} storeId={params.storeId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

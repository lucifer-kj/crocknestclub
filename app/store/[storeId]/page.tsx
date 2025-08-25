import { notFound } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { ProductCard } from '@/components/storefront/product-card'
import { CategoryCard } from '@/components/storefront/category-card'
import { BillboardCard } from '@/components/storefront/billboard-card'

interface StorePageProps {
  params: {
    storeId: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const store = await prismadb.store.findUnique({
    where: {
      id: params.storeId
    }
  })

  if (!store) {
    notFound()
  }

  const featuredProducts = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      isFeatured: true,
      isArchived: false
    },
    include: {
      images: true,
      category: true,
      size: true,
      color: true
    },
    take: 8
  })

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    take: 6
  })

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    take: 3
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Billboards */}
      {billboards.length > 0 && (
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {billboards.map((billboard) => (
                <BillboardCard key={billboard.id} billboard={billboard} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} storeId={params.storeId} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} storeId={params.storeId} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Store Info */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to {store.name}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our amazing collection of products. We&apos;re committed to providing you with the best shopping experience.
          </p>
        </div>
      </section>
    </div>
  )
}

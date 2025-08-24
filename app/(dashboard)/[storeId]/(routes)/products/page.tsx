import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  // Optimized query with all related data in a single request
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      size: {
        select: {
          id: true,
          name: true
        }
      },
      color: {
        select: {
          id: true,
          name: true,
          value: true
        }
      },
      images: {
        select: {
          id: true,
          url: true
        },
        take: 1 // Only get first image for list view
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
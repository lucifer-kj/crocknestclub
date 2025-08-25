"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Product, Category, Size, Color, Image as ProductImage } from '@prisma/client'
import { formatter } from '@/lib/utils'

interface ProductCardProps {
  product: Product & {
    category: Category
    size: Size
    color: Color
    images: ProductImage[]
  }
  storeId: string
}

export function ProductCard({ product, storeId }: ProductCardProps) {
  const imageUrl = product.images[0]?.url || '/placeholder-product.jpg'

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/store/${storeId}/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500">{product.category.name}</span>
        </div>
        
        <Link href={`/store/${storeId}/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-gray-900">
            {formatter.format(product.price.toNumber())}
          </span>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{product.size.name}</span>
            <span>•</span>
            <span>{product.color.name}</span>
          </div>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

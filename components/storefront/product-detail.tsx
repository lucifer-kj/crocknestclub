"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Product, Category, Size, Color, Image as ProductImage } from '@prisma/client'
import { formatter } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ProductDetailProps {
  product: Product & {
    category: Category
    size: Size
    color: Color
    images: ProductImage[]
  }
  storeId: string
}

export function ProductDetail({ product, storeId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', { product, quantity })
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-500">{product.category.name}</span>
              {product.isFeatured && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600">
              {formatter.format(product.price.toNumber())}
            </p>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium">{product.size.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Color:</span>
              <span className="font-medium">{product.color.name}</span>
            </div>
          </div>

          <Separator />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementQuantity}
                  className="px-3 py-1"
                >
                  -
                </Button>
                <span className="px-4 py-1 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementQuantity}
                  className="px-3 py-1"
                >
                  +
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            >
              Add to Cart
            </Button>
          </div>

          <Separator />

          {/* Product Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">
              This is a high-quality {product.name} from our {product.category.name} collection. 
              Available in {product.size.name} size and {product.color.name} color. 
              Perfect for everyday use and designed with attention to detail.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

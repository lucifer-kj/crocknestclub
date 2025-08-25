"use client"

import Link from 'next/link'
import { Category } from '@prisma/client'

interface CategoryCardProps {
  category: Category
  storeId: string
}

export function CategoryCard({ category, storeId }: CategoryCardProps) {
  return (
    <Link href={`/store/${storeId}/categories/${category.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold text-center px-4">
            {category.name}
          </h3>
        </div>
        <div className="p-4 text-center">
          <p className="text-gray-600">Explore our {category.name} collection</p>
        </div>
      </div>
    </Link>
  )
}

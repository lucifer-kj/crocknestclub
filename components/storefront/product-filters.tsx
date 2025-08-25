"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Category, Color, Size } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface ProductFiltersProps {
  categories: Category[]
  colors: Color[]
  sizes: Size[]
  currentFilters: {
    categoryId?: string
    colorId?: string
    sizeId?: string
    isFeatured?: string
    search?: string
  }
  storeId: string
}

export function ProductFilters({ 
  categories, 
  colors, 
  sizes, 
  currentFilters, 
  storeId 
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`/store/${storeId}/products?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(`/store/${storeId}/products`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllFilters}
          className="text-blue-600 hover:text-blue-700"
        >
          Clear All
        </Button>
      </div>

      {/* Featured Products Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Featured</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={currentFilters.isFeatured === 'true'}
            onCheckedChange={(checked) => 
              updateFilters('isFeatured', checked ? 'true' : null)
            }
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Featured products only
          </label>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={currentFilters.categoryId === category.id}
                  onCheckedChange={(checked) => 
                    updateFilters('categoryId', checked ? category.id : null)
                  }
                />
                <label 
                  htmlFor={`category-${category.id}`} 
                  className="text-sm text-gray-700"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      {/* Colors Filter */}
      {colors.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
          <div className="space-y-2">
            {colors.map((color) => (
              <div key={color.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color.id}`}
                  checked={currentFilters.colorId === color.id}
                  onCheckedChange={(checked) => 
                    updateFilters('colorId', checked ? color.id : null)
                  }
                />
                <label 
                  htmlFor={`color-${color.id}`} 
                  className="text-sm text-gray-700"
                >
                  {color.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      {/* Sizes Filter */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Sizes</h4>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size.id}`}
                  checked={currentFilters.sizeId === size.id}
                  onCheckedChange={(checked) => 
                    updateFilters('sizeId', checked ? size.id : null)
                  }
                />
                <label 
                  htmlFor={`size-${size.id}`} 
                  className="text-sm text-gray-700"
                >
                  {size.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

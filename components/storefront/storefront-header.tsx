"use client"

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ShoppingCart, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function StorefrontHeader() {
  const params = useParams()
  const storeId = params.storeId as string
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/store/${storeId}`} className="text-2xl font-bold text-gray-900">
            CrockNest Club
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/store/${storeId}`} className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href={`/store/${storeId}/products`} className="text-gray-600 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link href={`/store/${storeId}/categories`} className="text-gray-600 hover:text-gray-900 transition-colors">
              Categories
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart (0)
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href={`/store/${storeId}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href={`/store/${storeId}/products`} className="text-gray-600 hover:text-gray-900 transition-colors">
                Products
              </Link>
              <Link href={`/store/${storeId}/categories`} className="text-gray-600 hover:text-gray-900 transition-colors">
                Categories
              </Link>
            </nav>
            
            {/* Mobile Search */}
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Store } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!storeName.trim()) {
      toast.error("Store name is required")
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: storeName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create store")
      }

      const store = await response.json()
      
      toast.success("Store created successfully!")
      
      // Redirect to the admin dashboard
      router.push(`/${store.id}`)
      
    } catch (error) {
      console.error("Error creating store:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Store className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Create Your Store</CardTitle>
            <p className="text-gray-600 mt-2">
              Get started by creating your first store
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="Enter store name..."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Store"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                After creating your store, you can:
              </p>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>• Access the admin dashboard to manage products</p>
                <p>• View your storefront at <code className="bg-gray-100 px-1 rounded">/store/[storeId]</code></p>
                <p>• Customize your store settings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SetupPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    console.log('SetupPage: User loaded:', isLoaded);
    console.log('SetupPage: User:', user?.id);
  }, [isLoaded, user]);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeName.trim()) {
      toast.error("Store name is required");
      return;
    }

    if (!user?.id) {
      toast.error("Please sign in to create a store");
      return;
    }

    try {
      setIsCreating(true);
      setLoading(true);
      
      console.log('Creating store with name:', storeName);
      console.log('User ID:', user.id);

      const response = await axios.post('/api/stores', { name: storeName.trim() });
      console.log('Store created successfully:', response.data);

      toast.success("Store created successfully!");
      
      // Redirect to the new store
      router.push(`/${response.data.id}`);
    } catch (error: any) {
      console.error('Store creation error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data || `Error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to create a store.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Store</CardTitle>
          <CardDescription>
            Add a new store to manage products and categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateStore} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                type="text"
                placeholder="E-Commerce"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={loading}
                required
                minLength={1}
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!storeName.trim() || loading}
              >
                {isCreating ? "Creating..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;
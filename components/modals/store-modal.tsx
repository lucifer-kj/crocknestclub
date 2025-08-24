"use client"

import * as z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

import { useStoreModal } from "@/hooks/use-store-modal"
import { useUser } from "@clerk/nextjs"
import { Modal } from "@/components/ui/modal"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must contain at least 1 character(s).",
  })
})

export const StoreModal = () => {
  const storeModal = useStoreModal()
  const { user, isLoaded } = useUser()

  const [loading, setLoading] = useState(false)

  // Add debugging for authentication
  useEffect(() => {
    console.log('StoreModal: Modal state:', storeModal.isOpen)
    console.log('StoreModal: User loaded:', isLoaded)
    console.log('StoreModal: User:', user?.id)
  }, [storeModal.isOpen, isLoaded, user])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  })

  // Add form debugging
  useEffect(() => {
    console.log('StoreModal: Form values:', form.getValues())
    console.log('StoreModal: Form errors:', form.formState.errors)
  }, [form.formState.errors])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      console.log('Creating store with values:', values)
      console.log('Current user:', user?.id)
      console.log('User loaded:', isLoaded)

      const response = await axios.post('/api/stores', values)
      console.log('Store created successfully:', response.data)

      window.location.assign(`/${response.data.id}`)
    } catch (error: any) {
      console.error('Store creation error:', error)
      
      // Better error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data || `Error: ${error.response.status}`
        toast.error(errorMessage)
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your connection.")
      } else {
        // Something else happened
        toast.error(error.message || "Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-Commerce"
                        disabled={loading}
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button 
                  disabled={loading}
                  variant="outline" 
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  type="submit"
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
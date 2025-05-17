"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useProductRequestStore } from "@/data/product-requests"

export function RequestProductDialog() {
  const { toast } = useToast()
  const { addRequest } = useProductRequestStore()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productName: "",
    description: "",
    budget: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.productName || !formData.description) {
        throw new Error("Please fill in all required fields")
      }

      // Submit to Supabase via our store
      await addRequest(formData)

      // Success
      toast({
        title: "Request Submitted",
        description: "Your product request has been submitted successfully. We'll review it shortly.",
      })

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        productName: "",
        description: "",
        budget: "",
        category: "",
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-950/30">
          Request a Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black border-red-500/20">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Request a Product</DialogTitle>
            <DialogDescription>
              Can't find what you're looking for? Let us know and we'll try to source it for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="bg-black/40 border-gray-700"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-black/40 border-gray-700"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name/Description *</Label>
              <Input
                id="productName"
                name="productName"
                placeholder="e.g., Nike Air Jordan 1 Chicago"
                className="bg-black/40 border-gray-700"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please provide any specific details about the product you're looking for, such as size, color, condition, etc."
                className="bg-black/40 border-gray-700 min-h-[100px]"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Optional)</Label>
                <Input
                  id="budget"
                  name="budget"
                  placeholder="e.g., $100-$200"
                  className="bg-black/40 border-gray-700"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-black/40 border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="apparel">Apparel</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="collectibles">Collectibles</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

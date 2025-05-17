"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProductStore, type Product } from "@/data/products"
import { Plus, Search, Edit, Trash, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import SellerMobileNav from "@/components/seller-mobile-nav"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SellerProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addProduct, updateProduct, deleteProduct } = useProductStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [seller, setSeller] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: "",
    image: "/placeholder.svg?height=300&width=300",
    description: "",
    categories: [],
    productId: "",
    quality: "AAA+",
    inStock: true,
    featured: false,
    numericPrice: 0,
  })

  // Check authentication and load seller data
  useEffect(() => {
    const checkAuth = async () => {
      // Check if seller is logged in via cookie
      const sellerLoggedIn = document.cookie.includes("seller_logged_in=true")
      const sellerId = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("seller_id="))
        ?.split("=")[1]

      if (!sellerLoggedIn || !sellerId) {
        router.push("/sellers/login")
        return
      }

      try {
        // Get seller data from Supabase
        const { data, error } = await supabase.from("sellers").select("*").eq("id", sellerId).single()

        if (error || !data) {
          throw new Error("Failed to fetch seller data")
        }

        setSeller(data)

        // Get seller's products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", sellerId)

        if (productsError) {
          throw productsError
        }

        // Transform products to match our frontend model
        const transformedProducts = productsData.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          numericPrice: item.numeric_price,
          image: item.image || "/placeholder.svg?height=300&width=300",
          description: item.description || "",
          categories: item.categories || [],
          productId: item.product_id || "",
          source: item.source || "WD",
          userCode: item.user_code || data.username,
          quality: item.quality || "AAA+",
          inStock: item.in_stock !== undefined ? item.in_stock : true,
          discount: item.discount,
          rating: item.rating,
          reviewCount: item.review_count,
          colors: item.colors || [],
          sizes: item.sizes || [],
          featured: item.featured || false,
          dateAdded: item.date_added,
          brandId: item.brand_id,
          additionalImages: item.additional_images,
          qcPictureUrl: item.qc_picture_url,
          productLink: item.product_link,
          sellerId: item.seller_id,
        }))

        setAllProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
      } catch (error) {
        console.error("Error fetching seller data:", error)
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        router.push("/sellers/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery) ||
          (product.categories && product.categories.some((cat) => cat.toLowerCase().includes(lowercaseQuery))),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(allProducts)
    }
  }, [searchQuery, allProducts])

  const handleAddProduct = async () => {
    if (!seller) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.price) {
        setError("Product name and price are required")
        setIsSubmitting(false)
        return
      }

      // Calculate numeric price
      const numericPrice = Number.parseFloat(newProduct.price?.replace(/[^\d.]/g, "") || "0")

      // Prepare product data
      const productToAdd = {
        ...newProduct,
        numericPrice,
        sellerId: seller.id,
        userCode: seller.username,
        source: "WD",
        dateAdded: new Date().toISOString(),
      }

      // Add product to Supabase via our store
      const newProductId = await addProduct(productToAdd as Omit<Product, "id">)

      // Add to junction table
      await supabase.from("seller_products").insert([{ seller_id: seller.id, product_id: newProductId }])

      // Refresh products list
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", seller.id)

      if (!productsError && productsData) {
        // Transform products to match our frontend model
        const transformedProducts = productsData.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          numericPrice: item.numeric_price,
          image: item.image || "/placeholder.svg?height=300&width=300",
          description: item.description || "",
          categories: item.categories || [],
          productId: item.product_id || "",
          source: item.source || "WD",
          userCode: item.user_code || seller.username,
          quality: item.quality || "AAA+",
          inStock: item.in_stock !== undefined ? item.in_stock : true,
          discount: item.discount,
          rating: item.rating,
          reviewCount: item.review_count,
          colors: item.colors || [],
          sizes: item.sizes || [],
          featured: item.featured || false,
          dateAdded: item.date_added,
          brandId: item.brand_id,
          additionalImages: item.additional_images,
          qcPictureUrl: item.qc_picture_url,
          productLink: item.product_link,
          sellerId: item.seller_id,
        }))

        setAllProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
      }

      // Reset form and close dialog
      setNewProduct({
        name: "",
        price: "",
        image: "/placeholder.svg?height=300&width=300",
        description: "",
        categories: [],
        productId: "",
        quality: "AAA+",
        inStock: true,
        featured: false,
        numericPrice: 0,
      })

      setIsAddDialogOpen(false)

      toast({
        title: "Product Added",
        description: "Your product has been added successfully",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      setError("Failed to add product. Please try again.")
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!seller || !selectedProduct) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.price) {
        setError("Product name and price are required")
        setIsSubmitting(false)
        return
      }

      // Calculate numeric price
      const numericPrice = Number.parseFloat(newProduct.price?.replace(/[^\d.]/g, "") || "0")

      // Prepare product data
      const productToUpdate = {
        ...newProduct,
        numericPrice,
      }

      // Update product in Supabase via our store
      await updateProduct(selectedProduct.id, productToUpdate)

      // Refresh products list
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", seller.id)

      if (!productsError && productsData) {
        // Transform products to match our frontend model
        const transformedProducts = productsData.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          numericPrice: item.numeric_price,
          image: item.image || "/placeholder.svg?height=300&width=300",
          description: item.description || "",
          categories: item.categories || [],
          productId: item.product_id || "",
          source: item.source || "WD",
          userCode: item.user_code || seller.username,
          quality: item.quality || "AAA+",
          inStock: item.in_stock !== undefined ? item.in_stock : true,
          discount: item.discount,
          rating: item.rating,
          reviewCount: item.review_count,
          colors: item.colors || [],
          sizes: item.sizes || [],
          featured: item.featured || false,
          dateAdded: item.date_added,
          brandId: item.brand_id,
          additionalImages: item.additional_images,
          qcPictureUrl: item.qc_picture_url,
          productLink: item.product_link,
          sellerId: item.seller_id,
        }))

        setAllProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
      }

      // Reset form and close dialog
      setSelectedProduct(null)
      setIsEditDialogOpen(false)

      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      setError("Failed to update product. Please try again.")
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!seller) return

    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      // Delete product from Supabase via our store
      await deleteProduct(id)

      // Also delete from junction table
      await supabase.from("seller_products").delete().eq("seller_id", seller.id).eq("product_id", id)

      // Update local state
      const updatedProducts = allProducts.filter((product) => product.id !== id)
      setAllProducts(updatedProducts)
      setFilteredProducts(updatedProducts)

      toast({
        title: "Product Deleted",
        description: "Your product has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      categories: product.categories,
      productId: product.productId,
      quality: product.quality,
      inStock: product.inStock,
      featured: product.featured,
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!seller) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SellerMobileNav />

      <div className="container mx-auto px-4 py-12 pt-24 md:pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Products</h1>
            <p className="text-gray-400">Manage your product listings</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-red-900 hover:bg-red-800">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-red-500/20 text-white">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill in the details to add a new product to your store
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="bg-black/50 border-red-600/50"
                      placeholder="e.g. 45.99$"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="bg-black/50 border-red-600/50 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productId">Product ID</Label>
                    <Input
                      id="productId"
                      value={newProduct.productId}
                      onChange={(e) => setNewProduct({ ...newProduct, productId: e.target.value })}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality</Label>
                    <Select
                      value={newProduct.quality}
                      onValueChange={(value) => setNewProduct({ ...newProduct, quality: value as any })}
                    >
                      <SelectTrigger className="bg-black/50 border-red-600/50">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-red-500/20">
                        <SelectItem value="AAA+">AAA+</SelectItem>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="Budget">Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories (comma separated)</Label>
                    <Input
                      id="categories"
                      placeholder="e.g. Shoes, Nike, Sportswear"
                      value={newProduct.categories?.join(", ")}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          categories: e.target.value
                            .split(",")
                            .map((cat) => cat.trim())
                            .filter(Boolean),
                        })
                      }
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={newProduct.inStock}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, inStock: checked })}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={newProduct.featured}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-red-500/30 text-red-400"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="bg-red-900 hover:bg-red-800" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Add Product
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-black/50 border-red-600/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black/40 border-red-600/30 shadow-[0_0_15px_rgba(255,0,0,0.1)] h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-red-900/80">{product.quality}</Badge>
                    {product.featured && <Badge className="absolute top-2 left-2 bg-yellow-600/80">Featured</Badge>}
                  </div>
                  <CardContent className="flex-1 flex flex-col p-4">
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    <p className="text-red-400 font-medium mb-2">{product.price}</p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                    {product.categories && product.categories.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {product.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="border-red-500/30 text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600/50 hover:bg-red-900/20"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600/50 hover:bg-red-900/20 text-red-400"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No products found. Add your first product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border-red-500/20 text-white">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription className="text-gray-400">Update the details of your product</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-black/50 border-red-600/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-black/50 border-red-600/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="bg-black/50 border-red-600/50 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="bg-black/50 border-red-600/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-productId">Product ID</Label>
                <Input
                  id="edit-productId"
                  value={newProduct.productId}
                  onChange={(e) => setNewProduct({ ...newProduct, productId: e.target.value })}
                  className="bg-black/50 border-red-600/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quality">Quality</Label>
                <Select
                  value={newProduct.quality}
                  onValueChange={(value) => setNewProduct({ ...newProduct, quality: value as any })}
                >
                  <SelectTrigger className="bg-black/50 border-red-600/50">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-500/20">
                    <SelectItem value="AAA+">AAA+</SelectItem>
                    <SelectItem value="AA">AA</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-categories">Categories (comma separated)</Label>
                <Input
                  id="edit-categories"
                  placeholder="e.g. Shoes, Nike, Sportswear"
                  value={newProduct.categories?.join(", ")}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categories: e.target.value
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter(Boolean),
                    })
                  }
                  className="bg-black/50 border-red-600/50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-inStock"
                  checked={newProduct.inStock}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, inStock: checked })}
                />
                <Label htmlFor="edit-inStock">In Stock</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={newProduct.featured}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-red-500/30 text-red-400"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} className="bg-red-900 hover:bg-red-800" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

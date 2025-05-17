"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  addProduct,
  updateProduct,
  deleteProduct,
  addBrand,
  updateBrand,
  deleteBrand,
  addCollection,
  updateCollection,
  deleteCollection,
  addSeller,
  updateSeller,
  deleteSeller,
} from "../api/admin/actions"
import { useProductStore, type Product, type ProductQuality } from "@/data/products"
import { useBrandStore, type Brand } from "@/data/brands"
import { useCollectionStore, type Collection } from "@/data/collections"
import { useSellerStore, type Seller, sellerAPI } from "@/data/sellers"
import {
  BarChart3,
  Package,
  Tag,
  Users,
  Grid3X3,
  Search,
  Plus,
  Trash2,
  Edit,
  Star,
  ShoppingBag,
  ArrowUpDown,
  Filter,
  Download,
  Upload,
  LogOut,
  FileText,
} from "lucide-react"
import { brandAPI } from "@/data/brands"
import { AdminProductRequests } from "@/components/admin-product-requests"
import { useProductRequestStore } from "@/data/product-requests"

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Add this near the top with other state
  const { getPendingRequestCount } = useProductRequestStore()
  const pendingRequestCount = getPendingRequestCount()

  // Check authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-auth")
    if (adminAuth !== "authenticated") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsCheckingAuth(false)
  }, [router])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    router.push("/admin/login")
  }

  // Products state
  const {
    products,
    addProduct: addProductToStore,
    updateProduct: updateProductInStore,
    deleteProduct: deleteProductFromStore,
  } = useProductStore()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    numericPrice: 0,
    image: "/placeholder.svg?height=300&width=300",
    categories: [] as string[],
    productId: "",
    source: "WD",
    userCode: "KLLSC2",
    quality: "AA" as ProductQuality,
    inStock: true,
    featured: false,
    brandId: 0,
    rating: 0,
    reviewCount: 0,
    colors: [] as string[],
    sizes: [] as string[],
    additionalImages: [] as string[],
  })

  // Brands state
  const {
    brands,
    addBrand: addBrandToStore,
    updateBrand: updateBrandInStore,
    deleteBrand: deleteBrandFromStore,
  } = useBrandStore()
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [brandSearch, setBrandSearch] = useState("")
  const [brandDialogOpen, setBrandDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [brandForm, setBrandForm] = useState({
    name: "",
    logo: "",
    description: "",
    website: "",
    featured: false,
  })

  // Collections state
  const {
    collections,
    addCollection: addCollectionToStore,
    updateCollection: updateCollectionInStore,
    deleteCollection: deleteCollectionFromStore,
  } = useCollectionStore()
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([])
  const [collectionSearch, setCollectionSearch] = useState("")
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    description: "",
    image: "",
    count: 0,
    featured: false,
  })

  // Sellers state
  const {
    sellers,
    addSeller: addSellerToStore,
    updateSeller: updateSellerInStore,
    deleteSeller: deleteSellerFromStore,
  } = useSellerStore()
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([])
  const [sellerSearch, setSellerSearch] = useState("")
  const [sellerDialogOpen, setSellerDialogOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [sellerForm, setSellerForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    logo: "",
    description: "",
    verified: false,
    rating: 5,
    followers: 0,
    location: "",
    products: [] as string[],
  })

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Initialize filtered data
  useEffect(() => {
    setFilteredProducts(products)
    setFilteredBrands(brands)
    setFilteredCollections(collections)
    setFilteredSellers(sellers)
  }, [products, brands, collections, sellers])

  // Filter products based on search
  useEffect(() => {
    if (productSearch) {
      const lowercaseSearch = productSearch.toLowerCase()
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseSearch) ||
            product.description.toLowerCase().includes(lowercaseSearch) ||
            product.categories.some((cat) => cat.toLowerCase().includes(lowercaseSearch)),
        ),
      )
    } else {
      setFilteredProducts(products)
    }
  }, [productSearch, products])

  // Filter brands based on search
  useEffect(() => {
    if (brandSearch) {
      const lowercaseSearch = brandSearch.toLowerCase()
      setFilteredBrands(
        brands.filter(
          (brand) =>
            brand.name.toLowerCase().includes(lowercaseSearch) ||
            (brand.description && brand.description.toLowerCase().includes(lowercaseSearch)),
        ),
      )
    } else {
      setFilteredBrands(brands)
    }
  }, [brandSearch, brands])

  // Filter collections based on search
  useEffect(() => {
    if (collectionSearch) {
      const lowercaseSearch = collectionSearch.toLowerCase()
      setFilteredCollections(
        collections.filter(
          (collection) =>
            collection.name.toLowerCase().includes(lowercaseSearch) ||
            collection.description.toLowerCase().includes(lowercaseSearch),
        ),
      )
    } else {
      setFilteredCollections(collections)
    }
  }, [collectionSearch, collections])

  // Filter sellers based on search
  useEffect(() => {
    if (sellerSearch) {
      const lowercaseSearch = sellerSearch.toLowerCase()
      setFilteredSellers(
        sellers.filter(
          (seller) =>
            seller.name.toLowerCase().includes(lowercaseSearch) ||
            seller.description.toLowerCase().includes(lowercaseSearch) ||
            (seller.email && seller.email.toLowerCase().includes(lowercaseSearch)),
        ),
      )
    } else {
      setFilteredSellers(sellers)
    }
  }, [sellerSearch, sellers])

  // Product handlers
  const handleAddProduct = async () => {
    setIsLoading(true)
    try {
      // Convert price string to numeric price
      const numericPrice = Number.parseFloat(productForm.price.replace(/[^\d.]/g, "")) || 0

      // Create new product object
      const newProduct: Omit<Product, "id"> = {
        ...productForm,
        numericPrice,
        price: productForm.price.includes("$") ? productForm.price : `${productForm.price}$`,
        dateAdded: new Date().toISOString().slice(0, 10),
      }

      // Add to store
      const newId = addProductToStore(newProduct)

      // Call server action
      const result = await addProduct({
        ...newProduct,
        id: newId,
      } as Product)

      if (result.success) {
        setProductDialogOpen(false)
        resetProductForm()
        toast({
          title: "Success",
          description: "Product added successfully",
        })
      } else {
        throw new Error(result.error || "Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return

    setIsLoading(true)
    try {
      // Convert price string to numeric price
      const numericPrice = Number.parseFloat(productForm.price.replace(/[^\d.]/g, "")) || 0

      // Create updated product object
      const updatedProduct: Product = {
        ...selectedProduct,
        ...productForm,
        numericPrice,
        price: productForm.price.includes("$") ? productForm.price : `${productForm.price}$`,
      }

      // Update in store
      updateProductInStore(selectedProduct.id, updatedProduct)

      // Call server action
      const result = await updateProduct(updatedProduct)

      if (result.success) {
        setProductDialogOpen(false)
        resetProductForm()
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    setIsDeleting(true)
    try {
      // Delete from store
      deleteProductFromStore(id)

      // Call server action
      const result = await deleteProduct(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      numericPrice: 0,
      image: "/placeholder.svg?height=300&width=300",
      categories: [],
      productId: "",
      source: "WD",
      userCode: "KLLSC2",
      quality: "AA" as ProductQuality,
      inStock: true,
      featured: false,
      brandId: 0,
      rating: 0,
      reviewCount: 0,
      colors: [],
      sizes: [],
      additionalImages: [],
    })
    setSelectedProduct(null)
  }

  const openProductDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product)
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        numericPrice: product.numericPrice,
        image: product.image,
        categories: product.categories || [],
        productId: product.productId,
        source: product.source,
        userCode: product.userCode,
        quality: product.quality || "AA",
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured || false,
        brandId: product.brandId || 0,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        colors: product.colors || [],
        sizes: product.sizes || [],
        additionalImages: product.additionalImages || [],
      })
    } else {
      resetProductForm()
    }
    setProductDialogOpen(true)
  }

  // Brand handlers
  const handleAddBrand = async () => {
    setIsLoading(true)
    try {
      // Create new brand object
      const newBrand: Omit<Brand, "id"> = {
        ...brandForm,
        productCount: 0,
      }

      // Use the API to add brand (which will update the store)
      const result = await brandAPI.createBrand(newBrand)

      // Call server action
      const serverResult = await addBrand(result)

      if (serverResult.success) {
        setBrandDialogOpen(false)
        resetBrandForm()
        toast({
          title: "Success",
          description: "Brand added successfully",
        })
      } else {
        throw new Error(serverResult.error || "Failed to add brand")
      }
    } catch (error) {
      console.error("Error adding brand:", error)
      toast({
        title: "Error",
        description: "Failed to add brand. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBrand = async () => {
    if (!selectedBrand) return

    setIsLoading(true)
    try {
      // Create updated brand object
      const updatedBrand: Partial<Brand> = {
        ...brandForm,
      }

      // Use the API to update brand (which will update the store)
      await brandAPI.updateBrand(selectedBrand.id, updatedBrand)

      // Call server action
      const result = await updateBrand({
        ...selectedBrand,
        ...updatedBrand,
      } as Brand)

      if (result.success) {
        setBrandDialogOpen(false)
        resetBrandForm()
        toast({
          title: "Success",
          description: "Brand updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update brand")
      }
    } catch (error) {
      console.error("Error updating brand:", error)
      toast({
        title: "Error",
        description: "Failed to update brand. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBrand = async (id: number) => {
    setIsDeleting(true)
    try {
      // Use the API to delete brand (which will update the store)
      await brandAPI.deleteBrand(id)

      // Call server action
      const result = await deleteBrand(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Brand deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete brand")
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
      toast({
        title: "Error",
        description: "Failed to delete brand. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const resetBrandForm = () => {
    setBrandForm({
      name: "",
      logo: "",
      description: "",
      website: "",
      featured: false,
    })
    setSelectedBrand(null)
  }

  const openBrandDialog = (brand?: Brand) => {
    if (brand) {
      setSelectedBrand(brand)
      setBrandForm({
        name: brand.name,
        logo: brand.logo,
        description: brand.description || "",
        website: brand.website || "",
        featured: brand.featured || false,
      })
    } else {
      resetBrandForm()
    }
    setBrandDialogOpen(true)
  }

  // Collection handlers
  const handleAddCollection = async () => {
    setIsLoading(true)
    try {
      // Create new collection object
      const newCollection: Omit<Collection, "id"> = {
        ...collectionForm,
      }

      // Add to store
      const newId = Math.max(...collections.map((c) => c.id)) + 1
      addCollectionToStore({
        ...newCollection,
        id: newId,
      })

      // Call server action
      const result = await addCollection({
        ...newCollection,
        id: newId,
      } as Collection)

      if (result.success) {
        setCollectionDialogOpen(false)
        resetCollectionForm()
        toast({
          title: "Success",
          description: "Collection added successfully",
        })
      } else {
        throw new Error(result.error || "Failed to add collection")
      }
    } catch (error) {
      console.error("Error adding collection:", error)
      toast({
        title: "Error",
        description: "Failed to add collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCollection = async () => {
    if (!selectedCollection) return

    setIsLoading(true)
    try {
      // Create updated collection object
      const updatedCollection: Collection = {
        ...selectedCollection,
        ...collectionForm,
      }

      // Update in store
      updateCollectionInStore(selectedCollection.id, updatedCollection)

      // Call server action
      const result = await updateCollection(updatedCollection)

      if (result.success) {
        setCollectionDialogOpen(false)
        resetCollectionForm()
        toast({
          title: "Success",
          description: "Collection updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update collection")
      }
    } catch (error) {
      console.error("Error updating collection:", error)
      toast({
        title: "Error",
        description: "Failed to update collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCollection = async (id: number) => {
    setIsDeleting(true)
    try {
      // Delete from store
      deleteCollectionFromStore(id)

      // Call server action
      const result = await deleteCollection(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Collection deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete collection")
      }
    } catch (error) {
      console.error("Error deleting collection:", error)
      toast({
        title: "Error",
        description: "Failed to delete collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const resetCollectionForm = () => {
    setCollectionForm({
      name: "",
      description: "",
      image: "",
      count: 0,
      featured: false,
    })
    setSelectedCollection(null)
  }

  const openCollectionDialog = (collection?: Collection) => {
    if (collection) {
      setSelectedCollection(collection)
      setCollectionForm({
        name: collection.name,
        description: collection.description,
        image: collection.image,
        count: collection.count,
        featured: collection.featured,
      })
    } else {
      resetCollectionForm()
    }
    setCollectionDialogOpen(true)
  }

  // Seller handlers
  const handleAddSeller = async () => {
    setIsLoading(true)
    try {
      // Create new seller object
      const newSeller: Omit<Seller, "id" | "products"> = {
        ...sellerForm,
        joinDate: new Date().toISOString().slice(0, 10),
      }

      // Use the API to add seller (which will update the store)
      const result = await sellerAPI.createSeller(newSeller)

      // Call server action
      const serverResult = await addSeller({
        ...newSeller,
        id: result.id,
        products: [],
      } as Seller)

      if (serverResult.success) {
        setSellerDialogOpen(false)
        resetSellerForm()
        toast({
          title: "Success",
          description: "Seller added successfully",
        })
      } else {
        throw new Error(serverResult.error || "Failed to add seller")
      }
    } catch (error) {
      console.error("Error adding seller:", error)
      toast({
        title: "Error",
        description: "Failed to add seller. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSeller = async () => {
    if (!selectedSeller) return

    setIsLoading(true)
    try {
      // Create updated seller object
      const updatedSeller: Partial<Seller> = {
        ...sellerForm,
      }

      // Use the API to update seller (which will update the store)
      await sellerAPI.updateSeller(selectedSeller.id, updatedSeller)

      // Call server action
      const result = await updateSeller({
        ...selectedSeller,
        ...updatedSeller,
      } as Seller)

      if (result.success) {
        setSellerDialogOpen(false)
        resetSellerForm()
        toast({
          title: "Success",
          description: "Seller updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update seller")
      }
    } catch (error) {
      console.error("Error updating seller:", error)
      toast({
        title: "Error",
        description: "Failed to update seller. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSeller = async (id: string) => {
    setIsDeleting(true)
    try {
      // Use the API to delete seller (which will update the store)
      await sellerAPI.deleteSeller(id)

      // Call server action
      const result = await deleteSeller(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Seller deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete seller")
      }
    } catch (error) {
      console.error("Error deleting seller:", error)
      toast({
        title: "Error",
        description: "Failed to delete seller. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const resetSellerForm = () => {
    setSellerForm({
      name: "",
      username: "",
      password: "",
      email: "",
      logo: "",
      description: "",
      verified: false,
      rating: 5,
      followers: 0,
      location: "",
      products: [],
    })
    setSelectedSeller(null)
  }

  const openSellerDialog = (seller?: Seller) => {
    if (seller) {
      setSelectedSeller(seller)
      setSellerForm({
        name: seller.name,
        username: seller.username,
        password: seller.password || "",
        email: seller.email || "",
        logo: seller.logo,
        description: seller.description,
        verified: seller.verified,
        rating: seller.rating,
        followers: seller.followers || 0,
        location: seller.location || "",
        products: seller.products || [],
      })
    } else {
      resetSellerForm()
    }
    setSellerDialogOpen(true)
  }

  // Helper function to handle image upload
  const handleImageUpload = (imageData: string) => {
    setProductForm({
      ...productForm,
      image: imageData,
    })
  }

  // Helper function to handle logo upload
  const handleLogoUpload = (imageData: string) => {
    setBrandForm({
      ...brandForm,
      logo: imageData,
    })
  }

  // Helper function to handle collection image upload
  const handleCollectionImageUpload = (imageData: string) => {
    setCollectionForm({
      ...collectionForm,
      image: imageData,
    })
  }

  // Helper function to handle seller logo upload
  const handleSellerLogoUpload = (imageData: string) => {
    setSellerForm({
      ...sellerForm,
      logo: imageData,
    })
  }

  // Helper function to handle category input
  const handleCategoryInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault()
      const newCategory = e.currentTarget.value.trim()
      if (!productForm.categories.includes(newCategory)) {
        setProductForm({
          ...productForm,
          categories: [...productForm.categories, newCategory],
        })
      }
      e.currentTarget.value = ""
    }
  }

  // Helper function to remove a category
  const removeCategory = (category: string) => {
    setProductForm({
      ...productForm,
      categories: productForm.categories.filter((c) => c !== category),
    })
  }

  // Helper function to handle color input
  const handleColorInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault()
      const newColor = e.currentTarget.value.trim()
      if (!productForm.colors.includes(newColor)) {
        setProductForm({
          ...productForm,
          colors: [...productForm.colors, newColor],
        })
      }
      e.currentTarget.value = ""
    }
  }

  // Helper function to remove a color
  const removeColor = (color: string) => {
    setProductForm({
      ...productForm,
      colors: productForm.colors.filter((c) => c !== color),
    })
  }

  // Helper function to handle size input
  const handleSizeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault()
      const newSize = e.currentTarget.value.trim()
      if (!productForm.sizes.includes(newSize)) {
        setProductForm({
          ...productForm,
          sizes: [...productForm.sizes, newSize],
        })
      }
      e.currentTarget.value = ""
    }
  }

  // Helper function to remove a size
  const removeSize = (size: string) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter((s) => s !== size),
    })
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-500">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your products, brands, collections, and sellers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-500 text-red-500">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" className="border-red-500 text-red-500">
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-black/20 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Products</p>
                <h3 className="text-2xl font-bold text-white">{products.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Brands</p>
                <h3 className="text-2xl font-bold text-white">{brands.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Tag className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Collections</p>
                <h3 className="text-2xl font-bold text-white">{collections.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Grid3X3 className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Sellers</p>
                <h3 className="text-2xl font-bold text-white">{sellers.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Brands
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="sellers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sellers
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Product Requests
            {pendingRequestCount > 0 && activeTab !== "requests" && (
              <Badge variant="destructive" className="ml-1 bg-red-500">
                {pendingRequestCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-black/40 border-gray-700"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="border-gray-700">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-700">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
              <Button onClick={() => openProductDialog()} className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-black/20 border-red-500/20 overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {product.featured && (
                      <Badge className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {product.inStock ? (
                      <Badge className="bg-green-500">In Stock</Badge>
                    ) : (
                      <Badge className="bg-gray-500">Out of Stock</Badge>
                    )}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-red-500">{product.price}</span>
                    <Badge variant="outline" className="border-red-500/50 text-red-400">
                      {product.quality || "Standard"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.categories.slice(0, 3).map((category, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-black/40">
                        {category}
                      </Badge>
                    ))}
                    {product.categories.length > 3 && (
                      <Badge variant="secondary" className="bg-black/40">
                        +{product.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openProductDialog(product)}
                    className="border-red-500/50 text-red-400"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black border-red-500/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-black/20 rounded-lg border border-red-500/20">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400 mb-4">
                {productSearch ? "Try a different search term" : "Add your first product to get started"}
              </p>
              <Button onClick={() => openProductDialog()} className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-4">
          {/* Brands content - omitted for brevity */}
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-4">
          {/* Collections content - omitted for brevity */}
        </TabsContent>

        {/* Sellers Tab */}
        <TabsContent value="sellers" className="space-y-4">
          {/* Sellers content - omitted for brevity */}
        </TabsContent>

        {/* Product Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <AdminProductRequests />
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        {/* Product Dialog content - omitted for brevity */}
      </Dialog>

      {/* Brand Dialog */}
      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        {/* Brand Dialog content - omitted for brevity */}
      </Dialog>

      {/* Collection Dialog */}
      <Dialog open={collectionDialogOpen} onOpenChange={setCollectionDialogOpen}>
        {/* Collection Dialog content - omitted for brevity */}
      </Dialog>

      {/* Seller Dialog */}
      <Dialog open={sellerDialogOpen} onOpenChange={setSellerDialogOpen}>
        {/* Seller Dialog content - omitted for brevity */}
      </Dialog>
    </div>
  )
}

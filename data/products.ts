import { create } from "zustand"
import { supabase } from "@/lib/supabase"

export type ProductQuality = "AAA+" | "AA" | "Budget"

export interface Product {
  id: number
  name: string
  price: string
  numericPrice: number
  image: string
  description: string
  categories: string[]
  productId: string
  source: string
  userCode: string
  quality?: ProductQuality
  inStock?: boolean
  discount?: number
  rating?: number
  reviewCount?: number
  colors?: string[]
  sizes?: string[]
  featured?: boolean
  dateAdded?: string
  brandId?: number
  additionalImages?: string[]
  qcPictureUrl?: string
  productLink?: string
  slug?: string
  imageUrl?: string
  gender?: string
  sellerId?: string
}

// Initial products data as fallback
const initialProductsData: Product[] = [
  // Add some fallback products here
  {
    id: 1,
    name: "Nike Air Force 1",
    price: "45.99$",
    numericPrice: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Classic Nike Air Force 1 in white colorway.",
    categories: ["Shoes", "Nike"],
    productId: "AF1001",
    source: "WD",
    userCode: "KLLSC2",
    quality: "AAA+",
    inStock: true,
    rating: 4.8,
    reviewCount: 120,
    colors: ["White", "Black", "Red"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: true,
    dateAdded: "2023-09-01",
    brandId: 1,
  },
  // Add more fallback products as needed
]

// This is a fallback for components that directly import products
export const products: Product[] = [...initialProductsData]

// Helper functions that were previously used directly
export const getProductById = (id: number): Product | undefined => {
  return useProductStore.getState().products.find((product) => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return useProductStore.getState().filterProductsByCategory(category)
}

export const getFeaturedProducts = (): Product[] => {
  return useProductStore.getState().getFeaturedProducts()
}

interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => number
  updateProduct: (id: number, updatedProduct: Partial<Product>) => void
  deleteProduct: (id: number) => void
  searchProducts: (query: string) => Product[]
  filterProductsByCategory: (category: string) => Product[]
  filterProductsByQuality: (quality: ProductQuality) => Product[]
  filterProductsByPriceRange: (min: number, max: number) => Product[]
  filterProductsByBrand: (brandId: number) => Product[]
  filterProductsByGender: (gender: string) => Product[]
  sortProductsByPrice: (ascending: boolean) => Product[]
  sortProductsByRating: (ascending: boolean) => Product[]
  sortProductsByDate: (ascending: boolean) => Product[]
  getFeaturedProducts: () => Product[]
  getRelatedProducts: (productId: number) => Product[]
  getProductsBySeller: (sellerId: string) => Promise<Product[]>
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [...initialProductsData],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      // Check if supabase is available
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        set({
          products: [...initialProductsData],
          isLoading: false,
        })
        return
      }

      const { data, error } = await supabase.from("products").select("*")

      if (error) {
        throw error
      }

      if (!data || !Array.isArray(data)) {
        console.warn("No data returned from Supabase, using fallback data")
        set({
          products: [...initialProductsData],
          isLoading: false,
        })
        return
      }

      // Sort the data by ID
      const sortedData = [...data].sort((a, b) => a.id - b.id)

      // Transform the data to match our frontend model
      const transformedProducts = sortedData.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))

      // Update the direct export for backward compatibility
      products.length = 0
      products.push(...transformedProducts)

      set({
        products: transformedProducts,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching products:", error)

      // Use fallback data on error
      set({
        products: [...initialProductsData],
        error: "Failed to fetch products",
        isLoading: false,
      })
    }
  },

  addProduct: async (product) => {
    try {
      // Create a new product in Supabase
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: product.name,
            price: product.price,
            numeric_price: product.numericPrice || Number.parseFloat(product.price.replace(/[^0-9.]/g, "")),
            image: product.image,
            description: product.description,
            categories: product.categories,
            product_id: product.productId,
            source: product.source,
            user_code: product.userCode,
            quality: product.quality,
            in_stock: product.inStock,
            discount: product.discount,
            rating: product.rating,
            review_count: product.reviewCount,
            colors: product.colors,
            sizes: product.sizes,
            featured: product.featured,
            date_added: product.dateAdded || new Date().toISOString(),
            brand_id: product.brandId,
            additional_images: product.additionalImages,
            qc_picture_url: product.qcPictureUrl,
            product_link: product.productLink,
            gender: product.gender,
            seller_id: product.sellerId,
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      // If the product has a sellerId, add it to the seller_products junction table
      if (product.sellerId && data) {
        await supabase.from("seller_products").insert([
          {
            seller_id: product.sellerId,
            product_id: data.id,
          },
        ])
      }

      // Add the product to the store
      const newProduct = {
        id: data.id,
        name: data.name,
        price: data.price,
        numericPrice: data.numeric_price,
        image: data.image,
        description: data.description,
        categories: data.categories || [],
        productId: data.product_id,
        source: data.source,
        userCode: data.user_code,
        quality: data.quality,
        inStock: data.in_stock,
        discount: data.discount,
        rating: data.rating,
        reviewCount: data.review_count,
        colors: data.colors,
        sizes: data.sizes,
        featured: data.featured,
        dateAdded: data.date_added,
        brandId: data.brand_id,
        additionalImages: data.additional_images,
        qcPictureUrl: data.qc_picture_url,
        productLink: data.product_link,
        gender: data.gender,
        sellerId: data.seller_id,
      }

      set((state) => ({
        products: [...state.products, newProduct],
      }))

      // Update the direct export for backward compatibility
      products.push(newProduct)

      // Return the new ID
      return data.id
    } catch (error) {
      console.error("Error adding product:", error)

      // Fallback to local-only operation if Supabase fails
      const newId = Math.max(0, ...get().products.map((p) => p.id)) + 1

      const newProduct = {
        ...product,
        id: newId,
      }

      set((state) => ({
        products: [...state.products, newProduct as Product],
      }))

      // Update the direct export for backward compatibility
      products.push(newProduct as Product)

      return newId
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      // Update the product in Supabase
      const { error } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          numeric_price: updatedProduct.numericPrice,
          image: updatedProduct.image,
          description: updatedProduct.description,
          categories: updatedProduct.categories,
          product_id: updatedProduct.productId,
          source: updatedProduct.source,
          user_code: updatedProduct.userCode,
          quality: updatedProduct.quality,
          in_stock: updatedProduct.inStock,
          discount: updatedProduct.discount,
          rating: updatedProduct.rating,
          review_count: updatedProduct.reviewCount,
          colors: updatedProduct.colors,
          sizes: updatedProduct.sizes,
          featured: updatedProduct.featured,
          date_added: updatedProduct.dateAdded,
          brand_id: updatedProduct.brandId,
          additional_images: updatedProduct.additionalImages,
          qc_picture_url: updatedProduct.qcPictureUrl,
          product_link: updatedProduct.productLink,
          gender: updatedProduct.gender,
          seller_id: updatedProduct.sellerId,
        })
        .eq("id", id)

      if (error) {
        throw error
      }

      // Update the product in the store
      set((state) => ({
        products: state.products.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)),
      }))

      // Update the direct export for backward compatibility
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct }
      }
    } catch (error) {
      console.error("Error updating product:", error)

      // Fallback to local-only operation if Supabase fails
      set((state) => ({
        products: state.products.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)),
      }))

      // Update the direct export for backward compatibility
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct }
      }
    }
  },

  deleteProduct: async (id) => {
    try {
      // Delete the product from Supabase
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Delete from the store
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }))

      // Update the direct export for backward compatibility
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.splice(index, 1)
      }
    } catch (error) {
      console.error("Error deleting product:", error)

      // Fallback to local-only operation if Supabase fails
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }))

      // Update the direct export for backward compatibility
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.splice(index, 1)
      }
    }
  },

  searchProducts: (query) => {
    const lowercaseQuery = query.toLowerCase()
    return get().products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery),
    )
  },

  filterProductsByCategory: (category) => {
    return get().products.filter(
      (product) => product.categories && product.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
    )
  },

  filterProductsByQuality: (quality) => {
    return get().products.filter((product) => product.quality === quality)
  },

  filterProductsByPriceRange: (min, max) => {
    return get().products.filter((product) => product.numericPrice >= min && product.numericPrice <= max)
  },

  filterProductsByBrand: (brandId) => {
    return get().products.filter((product) => product.brandId === brandId)
  },

  filterProductsByGender: (gender) => {
    return get().products.filter((product) => product.gender === gender || product.gender === "unisex")
  },

  sortProductsByPrice: (ascending) => {
    return [...get().products].sort((a, b) =>
      ascending ? a.numericPrice - b.numericPrice : b.numericPrice - a.numericPrice,
    )
  },

  sortProductsByRating: (ascending) => {
    return [...get().products].sort((a, b) => {
      const ratingA = a.rating || 0
      const ratingB = b.rating || 0
      return ascending ? ratingA - ratingB : ratingB - ratingA
    })
  },

  sortProductsByDate: (ascending) => {
    return [...get().products].sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
      return ascending ? dateA - dateB : dateB - dateA
    })
  },

  getFeaturedProducts: () => {
    return get().products.filter((product) => product.featured)
  },

  getRelatedProducts: (productId) => {
    const product = get().products.find((p) => p.id === productId)
    if (!product) return []

    return get()
      .products.filter((p) => p.id !== productId && p.categories.some((cat) => product.categories.includes(cat)))
      .slice(0, 4)
  },

  getProductsBySeller: async (sellerId) => {
    try {
      // Get products by seller from Supabase
      const { data, error } = await supabase.from("products").select("*").eq("seller_id", sellerId)

      if (error) {
        throw error
      }

      if (!data || !Array.isArray(data)) {
        return []
      }

      // Transform the data to match our frontend model
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))
    } catch (error) {
      console.error("Error fetching products by seller:", error)
      return []
    }
  },
}))

// Helper functions for API routes
export const productAPI = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        return [...initialProductsData]
      }

      const { data, error } = await supabase.from("products").select("*")

      if (error) throw error

      if (!data || !Array.isArray(data)) {
        return [...initialProductsData]
      }

      // Sort the data by ID
      const sortedData = [...data].sort((a, b) => a.id - b.id)

      // Transform the data to match our frontend model
      return sortedData.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))
    } catch (error) {
      console.error("Error fetching all products:", error)
      return [...initialProductsData]
    }
  },

  getProductById: async (id: number): Promise<Product | null> => {
    try {
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        return initialProductsData.find((p) => p.id === id) || null
      }

      const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

      if (error) throw error

      if (!data) {
        return initialProductsData.find((p) => p.id === id) || null
      }

      // Transform the data to match our frontend model
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        numericPrice: data.numeric_price || Number.parseFloat(data.price.replace(/[^0-9.]/g, "")),
        image: data.image,
        description: data.description,
        categories: data.categories || [],
        productId: data.product_id,
        source: data.source,
        userCode: data.user_code,
        quality: data.quality,
        inStock: data.in_stock,
        discount: data.discount,
        rating: data.rating,
        reviewCount: data.review_count,
        colors: data.colors,
        sizes: data.sizes,
        featured: data.featured,
        dateAdded: data.date_added,
        brandId: data.brand_id,
        additionalImages: data.additional_images,
        qcPictureUrl: data.qc_picture_url,
        productLink: data.product_link,
        gender: data.gender,
        sellerId: data.seller_id,
      }
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error)
      return initialProductsData.find((p) => p.id === id) || null
    }
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        return initialProductsData.filter((p) => p.featured)
      }

      const { data, error } = await supabase.from("products").select("*").eq("featured", true)

      if (error) throw error

      if (!data || !Array.isArray(data)) {
        return initialProductsData.filter((p) => p.featured)
      }

      // Transform the data to match our frontend model
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))
    } catch (error) {
      console.error("Error fetching featured products:", error)
      return initialProductsData.filter((p) => p.featured)
    }
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        return initialProductsData.filter((p) =>
          p.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
        )
      }

      // This is a bit tricky with arrays in Postgres
      // We need to use the contains operator
      const { data, error } = await supabase.from("products").select("*")

      if (error) throw error

      if (!data || !Array.isArray(data)) {
        return initialProductsData.filter((p) =>
          p.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
        )
      }

      // Filter the data manually since the contains operator might not work as expected
      const filteredData = data.filter(
        (item) =>
          item.categories &&
          Array.isArray(item.categories) &&
          item.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
      )

      // Transform the data to match our frontend model
      return filteredData.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error)
      return initialProductsData.filter((p) => p.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()))
    }
  },

  getProductsByBrand: async (brandId: number): Promise<Product[]> => {
    try {
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        return initialProductsData.filter((p) => p.brandId === brandId)
      }

      const { data, error } = await supabase.from("products").select("*").eq("brand_id", brandId)

      if (error) throw error

      if (!data || !Array.isArray(data)) {
        return initialProductsData.filter((p) => p.brandId === brandId)
      }

      // Transform the data to match our frontend model
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))
    } catch (error) {
      console.error(`Error fetching products for brand ${brandId}:`, error)
      return initialProductsData.filter((p) => p.brandId === brandId)
    }
  },

  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    try {
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data")
        return initialProductsData.filter((p) => p.sellerId === sellerId)
      }

      const { data, error } = await supabase.from("products").select("*").eq("seller_id", sellerId)

      if (error) throw error

      if (!data || !Array.isArray(data)) {
        return initialProductsData.filter((p) => p.sellerId === sellerId)
      }

      // Transform the data to match our frontend model
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        numericPrice: item.numeric_price || Number.parseFloat(item.price.replace(/[^0-9.]/g, "")),
        image: item.image,
        description: item.description,
        categories: item.categories || [],
        productId: item.product_id,
        source: item.source,
        userCode: item.user_code,
        quality: item.quality,
        inStock: item.in_stock,
        discount: item.discount,
        rating: item.rating,
        reviewCount: item.review_count,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        dateAdded: item.date_added,
        brandId: item.brand_id,
        additionalImages: item.additional_images,
        qcPictureUrl: item.qc_picture_url,
        productLink: item.product_link,
        gender: item.gender,
        sellerId: item.seller_id,
      }))
    } catch (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error)
      return initialProductsData.filter((p) => p.sellerId === sellerId)
    }
  },
}

// Initialize the store by fetching products
if (typeof window !== "undefined") {
  useProductStore.getState().fetchProducts()
}

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import type { Product, ProductQuality } from "./products"

// Initial women's product data as fallback
const initialWomenProductsData: Product[] = [
  // Add some fallback women's products here
  {
    id: 101,
    name: "Women's Nike Air Force 1 Shadow",
    price: "45.99$",
    numericPrice: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Women's Nike Air Force 1 Shadow with layered design and pastel colors.",
    categories: ["Shoes", "Nike", "Women"],
    productId: "W1122334455",
    source: "WD",
    userCode: "KLLSC2",
    quality: "AAA+",
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    colors: ["Pink/White", "Purple/White", "Mint/White"],
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9"],
    featured: true,
    dateAdded: "2023-08-15",
    brandId: 1, // Nike
    gender: "women",
  },
  // Add more fallback women's products as needed
]

// Create a Zustand store for women's products
export interface WomenProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  searchProducts: (query: string) => Product[]
  filterProductsByCategory: (category: string) => Product[]
  filterProductsByQuality: (quality: ProductQuality) => Product[]
  filterProductsByPriceRange: (min: number, max: number) => Product[]
  filterProductsByBrand: (brandId: number) => Product[]
  sortProductsByPrice: (ascending: boolean) => Product[]
  sortProductsByRating: (ascending: boolean) => Product[]
  sortProductsByDate: (ascending: boolean) => Product[]
  getFeaturedProducts: () => Product[]
}

export const useWomenProducts = create<WomenProductStore>()(
  persist(
    (set, get) => ({
      products: [...initialWomenProductsData],
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        set({ isLoading: true, error: null })
        try {
          // Check if supabase is available
          if (!supabase || typeof supabase.from !== "function") {
            console.warn("Supabase client not available, using fallback data for women's products")
            set({
              products: [...initialWomenProductsData],
              isLoading: false,
            })
            return
          }

          const { data, error } = await supabase.from("products").select("*").eq("gender", "women")

          if (error) {
            throw error
          }

          if (!data || !Array.isArray(data)) {
            console.warn("No data returned from Supabase for women's products, using fallback data")
            set({
              products: [...initialWomenProductsData],
              isLoading: false,
            })
            return
          }

          // Transform the data to match our frontend model
          const transformedProducts = data.map((item) => ({
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
          }))

          set({
            products: transformedProducts,
            isLoading: false,
          })
        } catch (error) {
          console.error("Error fetching women's products:", error)

          // Use fallback data on error
          set({
            products: [...initialWomenProductsData],
            error: "Failed to fetch women's products",
            isLoading: false,
          })
        }
      },

      searchProducts: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.categories.some((category) => category.toLowerCase().includes(lowercaseQuery)),
        )
      },
      filterProductsByCategory: (category: string) => {
        return get().products.filter((product) =>
          product.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
        )
      },
      filterProductsByQuality: (quality: ProductQuality) => {
        return get().products.filter((product) => product.quality === quality)
      },
      filterProductsByPriceRange: (min: number, max: number) => {
        return get().products.filter((product) => product.numericPrice >= min && product.numericPrice <= max)
      },
      filterProductsByBrand: (brandId: number) => {
        return get().products.filter((product) => product.brandId === brandId)
      },
      sortProductsByPrice: (ascending: boolean) => {
        return [...get().products].sort((a, b) =>
          ascending ? a.numericPrice - b.numericPrice : b.numericPrice - a.numericPrice,
        )
      },
      sortProductsByRating: (ascending: boolean) => {
        return [...get().products].sort((a, b) => {
          const ratingA = a.rating || 0
          const ratingB = b.rating || 0
          return ascending ? ratingA - ratingB : ratingB - ratingA
        })
      },
      sortProductsByDate: (ascending: boolean) => {
        return [...get().products].sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
          return ascending ? dateA - dateB : dateB - dateA
        })
      },
      getFeaturedProducts: () => {
        return get().products.filter((product) => product.featured)
      },
    }),
    {
      name: "women-product-storage",
    },
  ),
)

// Initialize the store by fetching products
if (typeof window !== "undefined") {
  useWomenProducts.getState().fetchProducts()
}

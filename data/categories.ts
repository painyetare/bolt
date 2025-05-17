import { create } from "zustand"
import { supabase } from "@/lib/supabase"

export interface Category {
  id?: number
  name: string
  image: string
  count: number
  description?: string
  slug?: string
}

// Initial categories data as fallback
const initialCategoriesData: Category[] = [
  {
    id: 1,
    name: "Shoes",
    image: "/placeholder.svg?height=300&width=300",
    count: 120,
    description: "Explore our collection of high-quality replica shoes from top brands.",
    slug: "shoes",
  },
  {
    id: 2,
    name: "Clothing",
    image: "/placeholder.svg?height=300&width=300",
    count: 85,
    description: "Discover premium replica clothing items from designer brands.",
    slug: "clothing",
  },
  {
    id: 3,
    name: "Accessories",
    image: "/placeholder.svg?height=300&width=300",
    count: 65,
    description: "Browse our selection of replica accessories to complete your look.",
    slug: "accessories",
  },
  {
    id: 4,
    name: "Watches",
    image: "/placeholder.svg?height=300&width=300",
    count: 40,
    description: "Find high-quality replica watches from luxury brands.",
    slug: "watches",
  },
  {
    id: 5,
    name: "Bags",
    image: "/placeholder.svg?height=300&width=300",
    count: 55,
    description: "Explore our collection of replica bags and purses from top designers.",
    slug: "bags",
  },
  {
    id: 6,
    name: "Jewelry",
    image: "/placeholder.svg?height=300&width=300",
    count: 30,
    description: "Discover replica jewelry pieces that look just like the real thing.",
    slug: "jewelry",
  },
]

// Export categories for backward compatibility
export const categories: Category[] = [...initialCategoriesData]

// Create a Zustand store for categories
interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [...initialCategoriesData],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      // Check if supabase is available
      if (!supabase || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback data for categories")
        set({
          categories: [...initialCategoriesData],
          isLoading: false,
        })
        return
      }

      const { data, error } = await supabase.from("categories").select("*")

      if (error) {
        throw error
      }

      if (!data || !Array.isArray(data)) {
        console.warn("No data returned from Supabase for categories, using fallback data")
        set({
          categories: [...initialCategoriesData],
          isLoading: false,
        })
        return
      }

      // Transform the data to match our frontend model
      const transformedCategories = data.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || "/placeholder.svg?height=300&width=300",
        count: item.count || 0,
        description: item.description,
        slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"),
      }))

      // Update the direct export for backward compatibility
      categories.length = 0
      categories.push(...transformedCategories)

      set({
        categories: transformedCategories,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching categories:", error)

      // Use fallback data on error
      set({
        categories: [...initialCategoriesData],
        error: "Failed to fetch categories",
        isLoading: false,
      })
    }
  },
}))

// Initialize the store by fetching categories
if (typeof window !== "undefined") {
  useCategoryStore.getState().fetchCategories()
}

// Helper functions
export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find((category) => category.name.toLowerCase() === name.toLowerCase())
}

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((category) => category.slug === slug)
}

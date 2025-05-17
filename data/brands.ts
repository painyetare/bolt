import { create } from "zustand"
import { supabase } from "@/lib/supabase"

export interface Brand {
  id: number
  name: string
  description?: string
  logo: string
  website?: string
  featured?: boolean
  product_count?: number
}

// Sample brands data for fallback
export const brands = [
  {
    id: 1,
    name: "Nike",
    description: "Just Do It",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://www.nike.com",
    featured: true,
    product_count: 12,
  },
  {
    id: 2,
    name: "Adidas",
    description: "Impossible is Nothing",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://www.adidas.com",
    featured: true,
    product_count: 8,
  },
  {
    id: 3,
    name: "Jordan",
    description: "Authentic Jordan brand replicas",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://www.nike.com/jordan",
    featured: true,
    product_count: 10,
  },
  {
    id: 4,
    name: "Louis Vuitton",
    description: "Luxury fashion house",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://www.louisvuitton.com",
    featured: true,
    product_count: 6,
  },
  {
    id: 5,
    name: "Gucci",
    description: "Italian luxury brand",
    logo: "/placeholder.svg?height=200&width=200",
    website: "https://www.gucci.com",
    featured: false,
    product_count: 5,
  },
]

interface BrandState {
  brands: Brand[]
  isLoading: boolean
  error: string | null
  fetchBrands: () => Promise<void>
  addBrand: (brand: Omit<Brand, "id">) => Promise<number>
  updateBrand: (id: number, updatedBrand: Partial<Brand>) => Promise<void>
  deleteBrand: (id: number) => Promise<void>
  getFeaturedBrands: () => Brand[]
  getBrandById: (id: number) => Brand | undefined
  searchBrands: (query: string) => Promise<Brand[]>
}

export const useBrandStore = create<BrandState>((set, get) => ({
  brands: [...brands], // Initialize with sample data
  isLoading: false,
  error: null,

  fetchBrands: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.from("brands").select("*").order("id", { ascending: true })

      if (error) throw error

      // If we got data from Supabase, use it; otherwise, keep the sample data
      if (data && data.length > 0) {
        set({
          brands: data,
          isLoading: false,
        })
      } else {
        set({
          isLoading: false,
        })
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      set({
        error: "Failed to fetch brands",
        isLoading: false,
      })
    }
  },

  addBrand: async (brand) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.from("brands").insert([brand]).select().single()

      if (error) throw error

      set((state) => ({
        brands: [...state.brands, data],
        isLoading: false,
      }))

      return data.id
    } catch (error) {
      console.error("Error adding brand:", error)
      set({
        error: "Failed to add brand",
        isLoading: false,
      })
      return -1
    }
  },

  updateBrand: async (id, updatedBrand) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from("brands").update(updatedBrand).eq("id", id)

      if (error) throw error

      set((state) => ({
        brands: state.brands.map((brand) => (brand.id === id ? { ...brand, ...updatedBrand } : brand)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating brand:", error)
      set({
        error: "Failed to update brand",
        isLoading: false,
      })
    }
  },

  deleteBrand: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from("brands").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        brands: state.brands.filter((brand) => brand.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting brand:", error)
      set({
        error: "Failed to delete brand",
        isLoading: false,
      })
    }
  },

  getFeaturedBrands: () => {
    return get().brands.filter((brand) => brand.featured)
  },

  getBrandById: (id) => {
    return get().brands.find((brand) => brand.id === id)
  },

  searchBrands: async (query) => {
    try {
      const lowercaseQuery = query.toLowerCase()

      // Try to search in Supabase first
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .or(`name.ilike.%${lowercaseQuery}%,description.ilike.%${lowercaseQuery}%`)

        if (!error && data && data.length > 0) {
          return data
        }
      } catch (e) {
        console.warn("Supabase search failed, falling back to local search:", e)
      }

      // Fallback to local search
      return get().brands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(lowercaseQuery) ||
          (brand.description && brand.description.toLowerCase().includes(lowercaseQuery)),
      )
    } catch (error) {
      console.error("Error searching brands:", error)
      return []
    }
  },
}))

// Brand API for simulating backend operations
export const brandAPI = {
  getAllBrands: async (): Promise<Brand[]> => {
    try {
      const { data, error } = await supabase.from("brands").select("*").order("name", { ascending: true })

      if (error) throw error
      return data && data.length > 0 ? data : brands
    } catch (error) {
      console.error("Error fetching all brands:", error)
      return brands
    }
  },

  getBrandById: async (id: number): Promise<Brand | null> => {
    try {
      const { data, error } = await supabase.from("brands").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error)
      return brands.find((b) => b.id === id) || null
    }
  },

  getFeaturedBrands: async (): Promise<Brand[]> => {
    try {
      const { data, error } = await supabase.from("brands").select("*").eq("featured", true)

      if (error) throw error
      return data && data.length > 0 ? data : brands.filter((b) => b.featured)
    } catch (error) {
      console.error("Error fetching featured brands:", error)
      return brands.filter((b) => b.featured)
    }
  },

  createBrand: async (brand: Omit<Brand, "id">): Promise<Brand | null> => {
    try {
      const { data, error } = await supabase.from("brands").insert([brand]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating brand:", error)
      return null
    }
  },

  updateBrand: async (id: number, updates: Partial<Brand>): Promise<Brand | null> => {
    try {
      const { data, error } = await supabase.from("brands").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error updating brand with ID ${id}:`, error)
      return null
    }
  },

  deleteBrand: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase.from("brands").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Error deleting brand with ID ${id}:`, error)
      return false
    }
  },

  searchBrands: async (query: string): Promise<Brand[]> => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

      if (error) throw error
      return data && data.length > 0
        ? data
        : brands.filter(
            (b) =>
              b.name.toLowerCase().includes(query.toLowerCase()) ||
              (b.description && b.description.toLowerCase().includes(query.toLowerCase())),
          )
    } catch (error) {
      console.error(`Error searching brands with query "${query}":`, error)
      return brands.filter(
        (b) =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          (b.description && b.description.toLowerCase().includes(query.toLowerCase())),
      )
    }
  },
}

// Initialize the store by fetching brands
if (typeof window !== "undefined") {
  useBrandStore.getState().fetchBrands()
}

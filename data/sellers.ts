import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import Cookies from "js-cookie"
import { supabase } from "@/lib/supabase"
import { hashPassword } from "@/lib/auth-service"

export interface Seller {
  id: string
  name: string
  username: string
  password?: string
  email?: string
  logo: string
  products: string[]
  description: string
  verified: boolean
  rating: number
  joinDate: string
  followers: number
  location: string
  specialties?: string[]
  image?: string
  joinedDate?: string
}

// Custom storage for localStorage with better persistence
const localStorageBackend = {
  getItem: (name: string) => {
    try {
      const value = localStorage.getItem(name)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error getting from localStorage:", error)
      return null
    }
  },
  setItem: (name: string, value: unknown) => {
    try {
      localStorage.setItem(name, JSON.stringify(value))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

// Custom storage for cookies with 24-hour expiration (for auth only)
const cookieStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name)
    return value ? JSON.parse(value) : null
  },
  setItem: (name: string, value: unknown) => {
    // Set cookie with 24-hour expiration
    Cookies.set(name, JSON.stringify(value), { expires: 1 })
  },
  removeItem: (name: string) => {
    Cookies.remove(name)
  },
}

// Create a Zustand store for sellers
interface SellerStore {
  sellers: Seller[]
  currentSeller: Seller | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  fetchSellers: () => Promise<void>
  addSeller: (seller: Omit<Seller, "id" | "products">) => Promise<string>
  updateSeller: (id: string, updatedSeller: Partial<Seller>) => Promise<void>
  deleteSeller: (id: string) => Promise<void>
  login: (username: string, password: string) => Promise<Seller | null>
  logout: () => void
  addProductToSeller: (sellerId: string, productId: string) => Promise<void>
  removeProductFromSeller: (sellerId: string, productId: string) => Promise<void>
  getSellerProducts: (sellerId: string) => Promise<string[]>
  resetSellers: () => void
}

// Main seller store with persistence
export const useSellerStore = create<SellerStore>()(
  persist(
    (set, get) => ({
      sellers: [],
      currentSeller: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Fetch sellers from Supabase
      fetchSellers: async () => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.from("sellers").select("*")

          if (error) throw error

          // Transform data to match our frontend model
          const transformedSellers = data.map((seller) => ({
            id: seller.id,
            name: seller.name,
            username: seller.username,
            email: seller.email,
            logo: seller.logo || "/placeholder.svg?height=100&width=100",
            products: [], // We'll fetch products separately
            description: seller.description || "",
            verified: seller.verified,
            rating: seller.rating,
            joinDate: new Date(seller.join_date).toISOString().slice(0, 10),
            followers: seller.followers || 0,
            location: seller.location || "Unknown",
            specialties: seller.specialties || [],
            image: seller.image || seller.logo || "/placeholder.svg?height=100&width=100",
          }))

          set({ sellers: transformedSellers, isLoading: false })
        } catch (error) {
          console.error("Error fetching sellers:", error)
          set({ error: "Failed to fetch sellers", isLoading: false })
        }
      },

      // Login function
      login: async (username, password) => {
        try {
          const hashedPassword = hashPassword(password)

          const { data: seller, error } = await supabase
            .from("sellers")
            .select("*")
            .eq("username", username)
            .eq("password", hashedPassword)
            .single()

          if (error || !seller) {
            return null
          }

          // Transform to match our frontend model
          const transformedSeller = {
            id: seller.id,
            name: seller.name,
            username: seller.username,
            email: seller.email,
            logo: seller.logo || "/placeholder.svg?height=100&width=100",
            products: [], // We'll fetch products separately
            description: seller.description || "",
            verified: seller.verified,
            rating: seller.rating,
            joinDate: new Date(seller.join_date).toISOString().slice(0, 10),
            followers: seller.followers || 0,
            location: seller.location || "Unknown",
            specialties: seller.specialties || [],
            image: seller.image || seller.logo || "/placeholder.svg?height=100&width=100",
          }

          // Fetch seller's products
          const { data: sellerProducts, error: productsError } = await supabase
            .from("seller_products")
            .select("product_id")
            .eq("seller_id", seller.id)

          if (!productsError && sellerProducts) {
            transformedSeller.products = sellerProducts.map((sp) => sp.product_id.toString())
          }

          set({ currentSeller: transformedSeller, isAuthenticated: true })
          return transformedSeller
        } catch (error) {
          console.error("Login error:", error)
          return null
        }
      },

      // Logout function
      logout: () => {
        set({ currentSeller: null, isAuthenticated: false })
        // Also remove from localStorage
        localStorage.removeItem("seller")
        // Remove cookies
        document.cookie = "seller_logged_in=; path=/; max-age=0"
        document.cookie = "seller_id=; path=/; max-age=0"
      },

      // Add a new seller
      addSeller: async (seller) => {
        try {
          const hashedPassword = hashPassword(seller.password || "")

          const { data, error } = await supabase
            .from("sellers")
            .insert([
              {
                ...seller,
                password: hashedPassword,
                verified: seller.verified || false,
                rating: seller.rating || 5.0,
                followers: seller.followers || 0,
                location: seller.location || "Unknown",
                logo: seller.logo || "/placeholder.svg?height=100&width=100",
              },
            ])
            .select()
            .single()

          if (error) throw error

          // Transform to match our frontend model
          const newSeller = {
            id: data.id,
            name: data.name,
            username: data.username,
            email: data.email,
            logo: data.logo || "/placeholder.svg?height=100&width=100",
            products: [],
            description: data.description || "",
            verified: data.verified,
            rating: data.rating,
            joinDate: new Date(data.join_date).toISOString().slice(0, 10),
            followers: data.followers || 0,
            location: data.location || "Unknown",
            specialties: data.specialties || [],
            image: data.image || data.logo || "/placeholder.svg?height=100&width=100",
          }

          set((state) => ({ sellers: [...state.sellers, newSeller] }))
          return data.id
        } catch (error) {
          console.error("Error adding seller:", error)
          throw error
        }
      },

      // Update a seller
      updateSeller: async (id, updatedSeller) => {
        try {
          // If password is being updated, hash it
          if (updatedSeller.password) {
            updatedSeller.password = hashPassword(updatedSeller.password)
          }

          const { error } = await supabase.from("sellers").update(updatedSeller).eq("id", id)

          if (error) throw error

          // Update local state
          set((state) => ({
            sellers: state.sellers.map((seller) => (seller.id === id ? { ...seller, ...updatedSeller } : seller)),
            currentSeller:
              state.currentSeller?.id === id ? { ...state.currentSeller, ...updatedSeller } : state.currentSeller,
          }))
        } catch (error) {
          console.error("Error updating seller:", error)
          throw error
        }
      },

      // Delete a seller
      deleteSeller: async (id) => {
        try {
          const { error } = await supabase.from("sellers").delete().eq("id", id)

          if (error) throw error

          // Update local state
          set((state) => ({
            sellers: state.sellers.filter((seller) => seller.id !== id),
            currentSeller: state.currentSeller?.id === id ? null : state.currentSeller,
            isAuthenticated: state.currentSeller?.id === id ? false : state.isAuthenticated,
          }))
        } catch (error) {
          console.error("Error deleting seller:", error)
          throw error
        }
      },

      // Add a product to a seller
      addProductToSeller: async (sellerId, productId) => {
        try {
          // Add to junction table
          const { error } = await supabase
            .from("seller_products")
            .insert([{ seller_id: sellerId, product_id: Number.parseInt(productId) }])

          if (error) throw error

          // Update local state
          set((state) => ({
            sellers: state.sellers.map((seller) => {
              if (seller.id === sellerId) {
                return {
                  ...seller,
                  products: [...seller.products, productId],
                }
              }
              return seller
            }),
            currentSeller:
              state.currentSeller?.id === sellerId
                ? { ...state.currentSeller, products: [...state.currentSeller.products, productId] }
                : state.currentSeller,
          }))
        } catch (error) {
          console.error("Error adding product to seller:", error)
          throw error
        }
      },

      // Remove a product from a seller
      removeProductFromSeller: async (sellerId, productId) => {
        try {
          // Remove from junction table
          const { error } = await supabase
            .from("seller_products")
            .delete()
            .eq("seller_id", sellerId)
            .eq("product_id", Number.parseInt(productId))

          if (error) throw error

          // Update local state
          set((state) => ({
            sellers: state.sellers.map((seller) => {
              if (seller.id === sellerId) {
                return {
                  ...seller,
                  products: seller.products.filter((id) => id !== productId),
                }
              }
              return seller
            }),
            currentSeller:
              state.currentSeller?.id === sellerId
                ? { ...state.currentSeller, products: state.currentSeller.products.filter((id) => id !== productId) }
                : state.currentSeller,
          }))
        } catch (error) {
          console.error("Error removing product from seller:", error)
          throw error
        }
      },

      // Get seller products
      getSellerProducts: async (sellerId) => {
        try {
          const { data, error } = await supabase.from("seller_products").select("product_id").eq("seller_id", sellerId)

          if (error) throw error

          return data.map((item) => item.product_id.toString())
        } catch (error) {
          console.error("Error getting seller products:", error)
          return []
        }
      },

      // Reset sellers to initial data
      resetSellers: () => {
        set({ sellers: [], currentSeller: null, isAuthenticated: false })
      },
    }),
    {
      name: "seller-storage",
      storage: createJSONStorage(() => localStorageBackend),
      // Persist the entire state including sellers array
      partialize: (state) => ({
        sellers: state.sellers,
        currentSeller: state.currentSeller,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Auth-only store for session management
export const useSellerAuth = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentSellerId: null as string | null,
      login: (sellerId: string) => set({ isAuthenticated: true, currentSellerId: sellerId }),
      logout: () => set({ isAuthenticated: false, currentSellerId: null }),
    }),
    {
      name: "seller-auth",
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
)

// Helper functions
export async function getSellerById(id: string): Promise<Seller | undefined> {
  try {
    const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()

    if (error || !data) return undefined

    // Transform to match our frontend model
    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      logo: data.logo || "/placeholder.svg?height=100&width=100",
      products: [], // We'll fetch products separately if needed
      description: data.description || "",
      verified: data.verified,
      rating: data.rating,
      joinDate: new Date(data.join_date).toISOString().slice(0, 10),
      followers: data.followers || 0,
      location: data.location || "Unknown",
      specialties: data.specialties || [],
      image: data.image || data.logo || "/placeholder.svg?height=100&width=100",
    }
  } catch (error) {
    console.error("Error getting seller by ID:", error)
    return undefined
  }
}

export async function getSellerByUsername(username: string): Promise<Seller | undefined> {
  try {
    const { data, error } = await supabase.from("sellers").select("*").eq("username", username).single()

    if (error || !data) return undefined

    // Transform to match our frontend model
    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      logo: data.logo || "/placeholder.svg?height=100&width=100",
      products: [], // We'll fetch products separately if needed
      description: data.description || "",
      verified: data.verified,
      rating: data.rating,
      joinDate: new Date(data.join_date).toISOString().slice(0, 10),
      followers: data.followers || 0,
      location: data.location || "Unknown",
      specialties: data.specialties || [],
      image: data.image || data.logo || "/placeholder.svg?height=100&width=100",
    }
  } catch (error) {
    console.error("Error getting seller by username:", error)
    return undefined
  }
}

export async function getFeaturedSellers(): Promise<Seller[]> {
  try {
    const { data, error } = await supabase.from("sellers").select("*").eq("verified", true)

    if (error || !data) return []

    // Transform to match our frontend model
    return data.map((seller) => ({
      id: seller.id,
      name: seller.name,
      username: seller.username,
      email: seller.email,
      logo: seller.logo || "/placeholder.svg?height=100&width=100",
      products: [], // We'll fetch products separately if needed
      description: seller.description || "",
      verified: seller.verified,
      rating: seller.rating,
      joinDate: new Date(seller.join_date).toISOString().slice(0, 10),
      followers: seller.followers || 0,
      location: seller.location || "Unknown",
      specialties: seller.specialties || [],
      image: seller.image || seller.logo || "/placeholder.svg?height=100&width=100",
    }))
  } catch (error) {
    console.error("Error getting featured sellers:", error)
    return []
  }
}

// Backend-like API functions
export const sellerAPI = {
  // Get all sellers
  getAllSellers: async (): Promise<Seller[]> => {
    try {
      const { data, error } = await supabase.from("sellers").select("*")

      if (error) throw error

      // Transform to match our frontend model
      return data.map((seller) => ({
        id: seller.id,
        name: seller.name,
        username: seller.username,
        email: seller.email,
        logo: seller.logo || "/placeholder.svg?height=100&width=100",
        products: [], // We'll fetch products separately if needed
        description: seller.description || "",
        verified: seller.verified,
        rating: seller.rating,
        joinDate: new Date(seller.join_date).toISOString().slice(0, 10),
        followers: seller.followers || 0,
        location: seller.location || "Unknown",
        specialties: seller.specialties || [],
        image: seller.image || seller.logo || "/placeholder.svg?height=100&width=100",
      }))
    } catch (error) {
      console.error("Error getting all sellers:", error)
      return []
    }
  },

  // Get seller by ID
  getSellerById: async (id: string): Promise<Seller | null> => {
    try {
      const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()

      if (error || !data) return null

      // Transform to match our frontend model
      return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        logo: data.logo || "/placeholder.svg?height=100&width=100",
        products: [], // We'll fetch products separately if needed
        description: data.description || "",
        verified: data.verified,
        rating: data.rating,
        joinDate: new Date(data.join_date).toISOString().slice(0, 10),
        followers: data.followers || 0,
        location: data.location || "Unknown",
        specialties: data.specialties || [],
        image: data.image || data.logo || "/placeholder.svg?height=100&width=100",
      }
    } catch (error) {
      console.error("Error getting seller by ID:", error)
      return null
    }
  },

  // Create seller
  createSeller: async (sellerData: Omit<Seller, "id" | "products">): Promise<{ id: string }> => {
    try {
      // Hash password if provided
      const dataToInsert = { ...sellerData }
      if (dataToInsert.password) {
        dataToInsert.password = hashPassword(dataToInsert.password)
      }

      const { data, error } = await supabase.from("sellers").insert([dataToInsert]).select().single()

      if (error) throw error

      return { id: data.id }
    } catch (error) {
      console.error("Error creating seller:", error)
      throw error
    }
  },

  // Update seller
  updateSeller: async (id: string, sellerData: Partial<Seller>): Promise<boolean> => {
    try {
      // Hash password if provided
      const dataToUpdate = { ...sellerData }
      if (dataToUpdate.password) {
        dataToUpdate.password = hashPassword(dataToUpdate.password)
      }

      const { error } = await supabase.from("sellers").update(dataToUpdate).eq("id", id)

      if (error) throw error

      return true
    } catch (error) {
      console.error("Error updating seller:", error)
      return false
    }
  },

  // Delete seller
  deleteSeller: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("sellers").delete().eq("id", id)

      if (error) throw error

      return true
    } catch (error) {
      console.error("Error deleting seller:", error)
      return false
    }
  },

  // Authenticate seller
  authenticate: async (username: string, password: string): Promise<{ success: boolean; seller?: Seller }> => {
    try {
      const hashedPassword = hashPassword(password)

      const { data, error } = await supabase
        .from("sellers")
        .select("*")
        .eq("username", username)
        .eq("password", hashedPassword)
        .single()

      if (error || !data) {
        return { success: false }
      }

      // Transform to match our frontend model
      const seller = {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        logo: data.logo || "/placeholder.svg?height=100&width=100",
        products: [], // We'll fetch products separately if needed
        description: data.description || "",
        verified: data.verified,
        rating: data.rating,
        joinDate: new Date(data.join_date).toISOString().slice(0, 10),
        followers: data.followers || 0,
        location: data.location || "Unknown",
        specialties: data.specialties || [],
        image: data.image || data.logo || "/placeholder.svg?height=100&width=100",
      }

      return { success: true, seller }
    } catch (error) {
      console.error("Error authenticating seller:", error)
      return { success: false }
    }
  },
}

// Initialize the store by fetching sellers
if (typeof window !== "undefined") {
  useSellerStore.getState().fetchSellers()
}

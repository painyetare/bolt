import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import { loginSeller, logoutSeller, getSession } from "@/lib/auth-service"

// Define the Seller interface
export interface Seller {
  id: string
  username: string
  name: string
  email?: string
  logo?: string
  description?: string
  verified: boolean
  rating: number
  join_date: string
  followers: number
  location?: string
  specialties?: string[]
  products?: string[]
}

interface SellerState {
  sellers: Seller[]
  currentSeller: Seller | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  fetchSellers: () => Promise<void>
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  getSellerById: (id: string) => Promise<Seller | null>
  getSellerByUsername: (username: string) => Promise<Seller | null>
  updateSeller: (id: string, data: Partial<Seller>) => Promise<boolean>
  addSeller: (seller: Omit<Seller, "id" | "join_date" | "verified" | "rating" | "followers">) => Promise<string>
  deleteSeller: (id: string) => Promise<boolean>
  getVerifiedSellers: () => Seller[]
  fetchSellerById: (id: string) => Promise<Seller | null>
  fetchSellerByUsername: (username: string) => Promise<Seller | null>
  addProductToSeller: (sellerId: string, productId: string) => Promise<void>
  removeProductFromSeller: (sellerId: string, productId: string) => Promise<void>
  getSellerProducts: (sellerId: string) => Promise<string[]>
  register: (sellerData: any) => Promise<boolean>
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      sellers: [],
      currentSeller: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      fetchSellers: async () => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.from("sellers").select("*").order("name", { ascending: true })

          if (error) throw error

          set({
            sellers: data || [],
            isLoading: false,
          })
        } catch (error) {
          console.error("Error fetching sellers:", error)
          set({
            error: "Failed to fetch sellers",
            isLoading: false,
          })
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null })
        try {
          const result = await loginSeller(username, password)

          if (result.success && result.seller) {
            set({
              currentSeller: result.seller,
              isAuthenticated: true,
              isLoading: false,
            })
            return true
          } else {
            set({
              error: result.error || "Login failed",
              isLoading: false,
            })
            return false
          }
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await logoutSeller()
          set({
            currentSeller: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          })
        }
      },

      checkAuth: async () => {
        try {
          const session = await getSession()

          if (session) {
            // Fetch the seller data
            const { data, error } = await supabase
              .from("sellers")
              .select("*")
              .eq("username", session.user.email)
              .single()

            if (error) throw error

            if (data) {
              set({
                currentSeller: data,
                isAuthenticated: true,
              })
              return true
            }
          }

          return false
        } catch (error) {
          console.error("Auth check error:", error)
          return false
        }
      },

      getSellerById: async (id) => {
        try {
          const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()

          if (error) throw error
          return data
        } catch (error) {
          console.error("Error fetching seller by ID:", error)
          return null
        }
      },

      getSellerByUsername: async (username) => {
        try {
          const { data, error } = await supabase.from("sellers").select("*").eq("username", username).single()

          if (error) throw error
          return data
        } catch (error) {
          console.error("Error fetching seller by username:", error)
          return null
        }
      },

      updateSeller: async (id, sellerData) => {
        try {
          const { error } = await supabase.from("sellers").update(sellerData).eq("id", id)

          if (error) throw error

          // Update current seller if it's the same one
          if (get().currentSeller?.id === id) {
            set({
              currentSeller: {
                ...get().currentSeller!,
                ...sellerData,
              },
            })
          }

          // Update the sellers list
          set((state) => ({
            sellers: state.sellers.map((seller) => (seller.id === id ? { ...seller, ...sellerData } : seller)),
          }))

          return true
        } catch (error) {
          console.error("Error updating seller:", error)
          return false
        }
      },

      addSeller: async (seller) => {
        try {
          const { data, error } = await supabase
            .from("sellers")
            .insert([
              {
                ...seller,
                verified: false,
                rating: 5,
                followers: 0,
                join_date: new Date().toISOString(),
              },
            ])
            .select()
            .single()

          if (error) throw error

          // Update the sellers list
          set((state) => ({
            sellers: [...state.sellers, data],
          }))

          return data.id
        } catch (error) {
          console.error("Error adding seller:", error)
          return ""
        }
      },

      deleteSeller: async (id) => {
        try {
          const { error } = await supabase.from("sellers").delete().eq("id", id)

          if (error) throw error

          // Update the sellers list
          set((state) => ({
            sellers: state.sellers.filter((seller) => seller.id !== id),
          }))

          return true
        } catch (error) {
          console.error("Error deleting seller:", error)
          return false
        }
      },

      getVerifiedSellers: () => {
        return get().sellers.filter((seller) => seller.verified)
      },

      // Additional methods from the other store implementation
      fetchSellerById: async (id) => {
        try {
          const { data, error } = await supabase.from("sellers").select("*").eq("id", id).single()

          if (error) throw error

          return data
        } catch (error) {
          console.error("Error fetching seller by ID:", error)
          return null
        }
      },

      fetchSellerByUsername: async (username) => {
        try {
          const { data, error } = await supabase.from("sellers").select("*").eq("username", username).single()

          if (error) throw error

          return data
        } catch (error) {
          console.error("Error fetching seller by username:", error)
          return null
        }
      },

      addProductToSeller: async (sellerId, productId) => {
        try {
          const seller = await get().fetchSellerById(sellerId)
          if (!seller) throw new Error("Seller not found")

          const updatedProducts = [...(seller.products || []), productId]

          await get().updateSeller(sellerId, { products: updatedProducts })
        } catch (error) {
          set({ error: (error as Error).message })
          throw error
        }
      },

      removeProductFromSeller: async (sellerId, productId) => {
        try {
          const seller = await get().fetchSellerById(sellerId)
          if (!seller) throw new Error("Seller not found")

          const updatedProducts = (seller.products || []).filter((id) => id !== productId)

          await get().updateSeller(sellerId, { products: updatedProducts })
        } catch (error) {
          set({ error: (error as Error).message })
          throw error
        }
      },

      getSellerProducts: async (sellerId) => {
        try {
          const seller = await get().fetchSellerById(sellerId)
          return seller?.products || []
        } catch (error) {
          console.error("Error getting seller products:", error)
          return []
        }
      },

      register: async (sellerData) => {
        set({ isLoading: true, error: null })
        try {
          // In a real app, you'd call an API to register the seller
          // For now, we'll just add the seller to the database
          const id = await get().addSeller(sellerData)

          if (id) {
            const seller = await get().getSellerById(id)
            if (seller) {
              set({
                isAuthenticated: true,
                currentSeller: seller,
                error: null,
              })
              return true
            }
          }

          set({ error: "Registration failed" })
          return false
        } catch (error) {
          set({ error: (error as Error).message })
          return false
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "seller-store",
      partialize: (state) => ({
        currentSeller: state.currentSeller,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Initialize the store by fetching sellers
if (typeof window !== "undefined") {
  useSellerStore.getState().fetchSellers()
}

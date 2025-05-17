import { create } from "zustand"

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

  // Methods
  checkAuth: () => Promise<boolean>
  logout: () => Promise<void>
  addProductToSeller: (sellerId: string, productId: string) => void
  removeProductFromSeller: (sellerId: string, productId: string) => void
  getSellerProducts: (sellerId: string) => string[]
}

// Create a mock seller for testing
const mockSeller: Seller = {
  id: "1",
  username: "testseller",
  name: "Test Seller",
  email: "test@example.com",
  logo: "/placeholder.svg?height=100&width=100",
  description: "This is a test seller account",
  verified: true,
  rating: 4.5,
  join_date: new Date().toISOString(),
  followers: 100,
  location: "Test Location",
  specialties: ["Test Specialty"],
  products: ["1", "2", "3"], // Mock product IDs
}

export const useSellerStore = create<SellerState>()((set, get) => ({
  sellers: [mockSeller],
  currentSeller: mockSeller,
  isAuthenticated: true,
  isLoading: false,
  error: null,

  // Mock methods for testing
  checkAuth: async () => {
    // Always return true for testing
    set({ currentSeller: mockSeller, isAuthenticated: true })
    return true
  },

  logout: async () => {
    // Mock logout
    set({ currentSeller: null, isAuthenticated: false })
  },

  addProductToSeller: (sellerId, productId) => {
    set((state) => {
      const updatedSellers = state.sellers.map((seller) => {
        if (seller.id === sellerId) {
          return {
            ...seller,
            products: [...(seller.products || []), productId],
          }
        }
        return seller
      })

      // Also update currentSeller if it's the same seller
      let updatedCurrentSeller = state.currentSeller
      if (state.currentSeller && state.currentSeller.id === sellerId) {
        updatedCurrentSeller = {
          ...state.currentSeller,
          products: [...(state.currentSeller.products || []), productId],
        }
      }

      return {
        sellers: updatedSellers,
        currentSeller: updatedCurrentSeller,
      }
    })
  },

  removeProductFromSeller: (sellerId, productId) => {
    set((state) => {
      const updatedSellers = state.sellers.map((seller) => {
        if (seller.id === sellerId) {
          return {
            ...seller,
            products: (seller.products || []).filter((id) => id !== productId),
          }
        }
        return seller
      })

      // Also update currentSeller if it's the same seller
      let updatedCurrentSeller = state.currentSeller
      if (state.currentSeller && state.currentSeller.id === sellerId) {
        updatedCurrentSeller = {
          ...state.currentSeller,
          products: (state.currentSeller.products || []).filter((id) => id !== productId),
        }
      }

      return {
        sellers: updatedSellers,
        currentSeller: updatedCurrentSeller,
      }
    })
  },

  getSellerProducts: (sellerId) => {
    const seller = get().sellers.find((s) => s.id === sellerId)
    return seller?.products || []
  },
}))

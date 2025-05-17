import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"

export type RequestStatus = "pending" | "approved" | "rejected" | "fulfilled"

export interface ProductRequest {
  id: string
  name: string
  email: string
  productName: string
  description: string
  budget: string
  category: string
  status: RequestStatus
  createdAt: string
}

interface ProductRequestState {
  requests: ProductRequest[]
  isLoading: boolean
  error: string | null
  fetchRequests: () => Promise<void>
  addRequest: (request: Omit<ProductRequest, "id" | "status" | "createdAt">) => Promise<string>
  updateRequestStatus: (id: string, status: RequestStatus) => Promise<void>
  getRequestById: (id: string) => ProductRequest | undefined
  getPendingRequests: () => ProductRequest[]
  getPendingRequestCount: () => number
}

export const useProductRequestStore = create<ProductRequestState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from("product_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform the data to match our interface
      const transformedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        productName: item.product_name,
        description: item.description,
        budget: item.budget,
        category: item.category,
        status: item.status,
        createdAt: item.created_at,
      }))

      set({
        requests: transformedData || [],
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching product requests:", error)
      set({
        error: "Failed to fetch product requests",
        isLoading: false,
      })
    }
  },

  addRequest: async (request) => {
    set({ isLoading: true, error: null })
    try {
      const newId = uuidv4()

      // Transform the data to match Supabase column names
      const { data, error } = await supabase
        .from("product_requests")
        .insert([
          {
            id: newId,
            name: request.name,
            email: request.email,
            product_name: request.productName,
            description: request.description,
            budget: request.budget,
            category: request.category,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error

      // Add to local state with our interface format
      const newRequest: ProductRequest = {
        id: newId,
        name: request.name,
        email: request.email,
        productName: request.productName,
        description: request.description,
        budget: request.budget,
        category: request.category,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      set((state) => ({
        requests: [newRequest, ...state.requests],
        isLoading: false,
      }))

      return newId
    } catch (error) {
      console.error("Error adding product request:", error)
      set({
        error: "Failed to add product request",
        isLoading: false,
      })
      return ""
    }
  },

  updateRequestStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from("product_requests").update({ status }).eq("id", id)

      if (error) throw error

      set((state) => ({
        requests: state.requests.map((request) => (request.id === id ? { ...request, status } : request)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating product request status:", error)
      set({
        error: "Failed to update product request status",
        isLoading: false,
      })
    }
  },

  getRequestById: (id) => {
    return get().requests.find((request) => request.id === id)
  },

  getPendingRequests: () => {
    return get().requests.filter((request) => request.status === "pending")
  },

  getPendingRequestCount: () => {
    return get().requests.filter((request) => request.status === "pending").length
  },
}))

// Initialize the store by fetching product requests
if (typeof window !== "undefined") {
  useProductRequestStore.getState().fetchRequests()
}

import { create } from "zustand"
import { supabase } from "@/lib/supabase"

export interface Collection {
  id: number
  name: string
  description: string
  image: string
  count: number
  featured: boolean
}

interface CollectionState {
  collections: Collection[]
  isLoading: boolean
  error: string | null
  fetchCollections: () => Promise<void>
  addCollection: (collection: Omit<Collection, "id">) => Promise<number>
  updateCollection: (id: number, updatedCollection: Partial<Collection>) => Promise<void>
  deleteCollection: (id: number) => Promise<void>
  resetCollections: () => Promise<void>
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  isLoading: false,
  error: null,

  fetchCollections: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.from("collections").select("*").order("id", { ascending: true })

      if (error) throw error

      set({
        collections: data || [],
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching collections:", error)
      set({
        error: "Failed to fetch collections",
        isLoading: false,
      })
    }
  },

  addCollection: async (collection) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.from("collections").insert([collection]).select().single()

      if (error) throw error

      set((state) => ({
        collections: [...state.collections, data],
        isLoading: false,
      }))

      return data.id
    } catch (error) {
      console.error("Error adding collection:", error)
      set({
        error: "Failed to add collection",
        isLoading: false,
      })
      return -1
    }
  },

  updateCollection: async (id, updatedCollection) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from("collections").update(updatedCollection).eq("id", id)

      if (error) throw error

      set((state) => ({
        collections: state.collections.map((collection) =>
          collection.id === id ? { ...collection, ...updatedCollection } : collection,
        ),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating collection:", error)
      set({
        error: "Failed to update collection",
        isLoading: false,
      })
    }
  },

  deleteCollection: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from("collections").delete().eq("id", id)

      if (error) throw error

      set((state) => ({
        collections: state.collections.filter((collection) => collection.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting collection:", error)
      set({
        error: "Failed to delete collection",
        isLoading: false,
      })
    }
  },

  resetCollections: async () => {
    set({ isLoading: true, error: null })
    try {
      // This would typically be a more complex operation in a real app
      // For now, we'll just fetch the collections again
      await get().fetchCollections()
    } catch (error) {
      console.error("Error resetting collections:", error)
      set({
        error: "Failed to reset collections",
        isLoading: false,
      })
    }
  },
}))

// Helper functions
export function getFeaturedCollections(): Collection[] {
  return useCollectionStore.getState().collections.filter((collection) => collection.featured)
}

export function getCollectionById(id: number): Collection | undefined {
  return useCollectionStore.getState().collections.find((collection) => collection.id === id)
}

// Initialize the store by fetching collections
if (typeof window !== "undefined") {
  useCollectionStore.getState().fetchCollections()
}

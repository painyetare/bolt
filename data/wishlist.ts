import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./products"

export interface WishlistItem {
  productId: number
  dateAdded: string
}

export interface WishlistStore {
  items: WishlistItem[]
  addItem: (productId: number) => void
  removeItem: (productId: number) => void
  clearWishlist: () => void
  isInWishlist: (productId: number) => boolean
  getWishlistCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        if (get().isInWishlist(productId)) return

        set((state) => ({
          items: [
            ...state.items,
            {
              productId,
              dateAdded: new Date().toISOString(),
            },
          ],
        }))
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },
      getWishlistCount: () => {
        return get().items.length
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
)

// Helper function to get wishlist products from product store
export function getWishlistProducts(products: Product[]): Product[] {
  const wishlistStore = useWishlistStore.getState()
  const wishlistProductIds = wishlistStore.items.map((item) => item.productId)

  return products.filter((product) => wishlistProductIds.includes(product.id))
}

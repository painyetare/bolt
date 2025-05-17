import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./products"

export interface CartItem {
  productId: number
  quantity: number
  color?: string
  size?: string
  dateAdded: string
}

export interface CartStore {
  items: CartItem[]
  addItem: (productId: number, quantity?: number, color?: string, size?: string) => void
  updateItem: (productId: number, updates: Partial<Omit<CartItem, "productId" | "dateAdded">>) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  getItemQuantity: (productId: number) => number
  getTotalItems: () => number
  getTotalPrice: (products: Product[]) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, quantity = 1, color, size) => {
        const existingItem = get().items.find((item) => item.productId === productId)

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    color: color || item.color,
                    size: size || item.size,
                  }
                : item,
            ),
          }))
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                productId,
                quantity,
                color,
                size,
                dateAdded: new Date().toISOString(),
              },
            ],
          }))
        }
      },
      updateItem: (productId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  ...updates,
                }
              : item,
          ),
        }))
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.productId === productId)
        return item ? item.quantity : 0
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: (products) => {
        return get().items.reduce((total, item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return total

          const price = product.numericPrice || Number.parseFloat(product.price.replace("$", ""))
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

// Helper function to get cart products with quantities
export function getCartProductsWithQuantities(
  products: Product[],
): (Product & { quantity: number; color?: string; size?: string })[] {
  const cartStore = useCartStore.getState()

  return cartStore.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error(`Product with ID ${item.productId} not found`)

    return {
      ...product,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }
  })
}

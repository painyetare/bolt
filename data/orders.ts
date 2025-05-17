import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./cart"

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export interface OrderItem extends CartItem {
  price: number
  name: string
}

export interface ShippingInfo {
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
  updatedAt: string
  shippingInfo: ShippingInfo
  trackingNumber?: string
  shippingMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  notes?: string
}

// Initial orders data
const initialOrdersData: Order[] = [
  {
    id: "ORD12345",
    userId: "user123",
    items: [
      {
        productId: 1,
        quantity: 1,
        color: "White",
        size: "US 9",
        dateAdded: "2023-09-01",
        price: 39.99,
        name: "Air Force 1 AF White",
      },
      {
        productId: 5,
        quantity: 1,
        dateAdded: "2023-09-01",
        price: 59.99,
        name: "Nike Tech Fleece Set",
      },
    ],
    status: "delivered",
    createdAt: "2023-09-01",
    updatedAt: "2023-09-10",
    shippingInfo: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 555-123-4567",
    },
    trackingNumber: "TRK789012345",
    shippingMethod: "Standard Shipping",
    subtotal: 99.98,
    shipping: 12.99,
    tax: 8.5,
    total: 121.47,
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD67890",
    userId: "user123",
    items: [
      {
        productId: 2,
        quantity: 1,
        color: "Bred",
        size: "US 10",
        dateAdded: "2023-08-15",
        price: 70.12,
        name: "IGX Jordan 4 (20+ Styles)",
      },
    ],
    status: "shipped",
    createdAt: "2023-08-15",
    updatedAt: "2023-08-20",
    shippingInfo: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 555-123-4567",
    },
    trackingNumber: "TRK456789012",
    shippingMethod: "Express Shipping",
    subtotal: 70.12,
    shipping: 18.99,
    tax: 6.75,
    total: 95.86,
    paymentMethod: "PayPal",
  },
]

// Create a Zustand store for orders with persistence
export interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => string
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateTrackingNumber: (id: string, trackingNumber: string) => void
  getUserOrders: (userId: string) => Order[]
  getOrderById: (id: string) => Order | undefined
  cancelOrder: (id: string) => void
  resetOrders: () => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: initialOrdersData,
      addOrder: (order) => {
        const id = `ORD${Math.floor(100000 + Math.random() * 900000)}`
        const now = new Date().toISOString()

        set((state) => ({
          orders: [
            ...state.orders,
            {
              ...order,
              id,
              createdAt: now,
              updatedAt: now,
            },
          ],
        }))

        return id
      },
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : order,
          ),
        })),
      updateTrackingNumber: (id, trackingNumber) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  trackingNumber,
                  updatedAt: new Date().toISOString(),
                }
              : order,
          ),
        })),
      getUserOrders: (userId) => {
        return get().orders.filter((order) => order.userId === userId)
      },
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id)
      },
      cancelOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  status: "cancelled",
                  updatedAt: new Date().toISOString(),
                }
              : order,
          ),
        }))
      },
      resetOrders: () => set({ orders: initialOrdersData }),
    }),
    {
      name: "order-storage",
    },
  ),
)

// Helper functions
export function getOrdersByStatus(status: OrderStatus): Order[] {
  return initialOrdersData.filter((order) => order.status === status)
}

export function getOrdersByUser(userId: string): Order[] {
  return initialOrdersData.filter((order) => order.userId === userId)
}

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
  lastLogin?: string
  preferences: {
    newsletter: boolean
    darkMode: boolean
    language: string
  }
  shippingAddresses: ShippingAddress[]
}

export interface ShippingAddress {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

// Mock user data
const initialUsersData: User[] = [
  {
    id: "user123",
    email: "john@example.com",
    name: "John Doe",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "user",
    createdAt: "2023-01-15",
    lastLogin: "2023-09-10",
    preferences: {
      newsletter: true,
      darkMode: false,
      language: "en",
    },
    shippingAddresses: [
      {
        id: "addr1",
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        phone: "+1 555-123-4567",
        isDefault: true,
      },
    ],
  },
  {
    id: "admin456",
    email: "admin@w2c.ro",
    name: "Admin User",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "admin",
    createdAt: "2022-12-01",
    lastLogin: "2023-09-12",
    preferences: {
      newsletter: false,
      darkMode: true,
      language: "en",
    },
    shippingAddresses: [],
  },
]

// Create a Zustand store for users with persistence
export interface UserStore {
  users: User[]
  currentUser: User | null
  addUser: (user: Omit<User, "id" | "createdAt" | "role">) => void
  updateUser: (id: string, updatedUser: Partial<User>) => void
  deleteUser: (id: string) => void
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  addShippingAddress: (userId: string, address: Omit<ShippingAddress, "id">) => void
  updateShippingAddress: (userId: string, addressId: string, updates: Partial<ShippingAddress>) => void
  deleteShippingAddress: (userId: string, addressId: string) => void
  setDefaultShippingAddress: (userId: string, addressId: string) => void
  updatePreferences: (userId: string, preferences: Partial<User["preferences"]>) => void
  resetUsers: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: initialUsersData,
      currentUser: null,
      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...user,
              id: `user${Date.now()}`,
              createdAt: new Date().toISOString(),
              role: "user",
              shippingAddresses: [],
              preferences: {
                newsletter: false,
                darkMode: false,
                language: "en",
                ...user.preferences,
              },
            },
          ],
        })),
      updateUser: (id, updatedUser) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...updatedUser } : state.currentUser,
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          currentUser: state.currentUser?.id === id ? null : state.currentUser,
        })),
      login: async (email, password) => {
        // In a real app, you would validate the password here
        // This is just a mock implementation
        const user = get().users.find((u) => u.email === email)
        if (user) {
          set((state) => ({
            currentUser: user,
            users: state.users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u)),
          }))
          return user
        }
        return null
      },
      logout: () => {
        set({ currentUser: null })
      },
      addShippingAddress: (userId, address) =>
        set((state) => {
          const newAddress = {
            ...address,
            id: `addr${Date.now()}`,
            isDefault: address.isDefault || state.users.find((u) => u.id === userId)?.shippingAddresses.length === 0,
          }

          return {
            users: state.users.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    shippingAddresses: address.isDefault
                      ? [...user.shippingAddresses.map((addr) => ({ ...addr, isDefault: false })), newAddress]
                      : [...user.shippingAddresses, newAddress],
                  }
                : user,
            ),
            currentUser:
              state.currentUser?.id === userId
                ? {
                    ...state.currentUser,
                    shippingAddresses: address.isDefault
                      ? [
                          ...state.currentUser.shippingAddresses.map((addr) => ({
                            ...addr,
                            isDefault: false,
                          })),
                          newAddress,
                        ]
                      : [...state.currentUser.shippingAddresses, newAddress],
                  }
                : state.currentUser,
          }
        }),
      updateShippingAddress: (userId, addressId, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  shippingAddresses: user.shippingAddresses.map((addr) =>
                    addr.id === addressId ? { ...addr, ...updates } : addr,
                  ),
                }
              : user,
          ),
          currentUser:
            state.currentUser?.id === userId
              ? {
                  ...state.currentUser,
                  shippingAddresses: state.currentUser.shippingAddresses.map((addr) =>
                    addr.id === addressId ? { ...addr, ...updates } : addr,
                  ),
                }
              : state.currentUser,
        })),
      deleteShippingAddress: (userId, addressId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  shippingAddresses: user.shippingAddresses.filter((addr) => addr.id !== addressId),
                }
              : user,
          ),
          currentUser:
            state.currentUser?.id === userId
              ? {
                  ...state.currentUser,
                  shippingAddresses: state.currentUser.shippingAddresses.filter((addr) => addr.id !== addressId),
                }
              : state.currentUser,
        })),
      setDefaultShippingAddress: (userId, addressId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  shippingAddresses: user.shippingAddresses.map((addr) => ({
                    ...addr,
                    isDefault: addr.id === addressId,
                  })),
                }
              : user,
          ),
          currentUser:
            state.currentUser?.id === userId
              ? {
                  ...state.currentUser,
                  shippingAddresses: state.currentUser.shippingAddresses.map((addr) => ({
                    ...addr,
                    isDefault: addr.id === addressId,
                  })),
                }
              : state.currentUser,
        })),
      updatePreferences: (userId, preferences) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  preferences: { ...user.preferences, ...preferences },
                }
              : user,
          ),
          currentUser:
            state.currentUser?.id === userId
              ? {
                  ...state.currentUser,
                  preferences: { ...state.currentUser.preferences, ...preferences },
                }
              : state.currentUser,
        })),
      resetUsers: () => set({ users: initialUsersData, currentUser: null }),
    }),
    {
      name: "user-storage",
    },
  ),
)

// Helper functions
export function getUserById(id: string): User | undefined {
  return initialUsersData.find((user) => user.id === id)
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

import { create } from "zustand"
import type { Product } from "./products"
import type { Category } from "./categories"

export interface SearchResult {
  products: Product[]
  categories: Category[]
  recentSearches: string[]
}

export interface SearchStore {
  query: string
  recentSearches: string[]
  setQuery: (query: string) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  removeRecentSearch: (query: string) => void
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: "",
  recentSearches: [],
  setQuery: (query) => set({ query }),
  addRecentSearch: (query) => {
    if (!query.trim()) return

    set((state) => {
      // Remove the query if it already exists to avoid duplicates
      const filteredSearches = state.recentSearches.filter((search) => search.toLowerCase() !== query.toLowerCase())

      // Add the new query to the beginning and limit to 10 recent searches
      return {
        recentSearches: [query, ...filteredSearches].slice(0, 10),
      }
    })
  },
  clearRecentSearches: () => set({ recentSearches: [] }),
  removeRecentSearch: (query) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((search) => search.toLowerCase() !== query.toLowerCase()),
    })),
}))

// Search function that combines products and categories
export function searchAll(query: string, products: Product[], categories: Category[]): SearchResult {
  const lowercaseQuery = query.toLowerCase()

  // Search products
  const matchedProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.categories.some((category) => category.toLowerCase().includes(lowercaseQuery)),
  )

  // Search categories
  const matchedCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(lowercaseQuery) ||
      (category.description && category.description.toLowerCase().includes(lowercaseQuery)),
  )

  // Add to recent searches
  const searchStore = useSearchStore.getState()
  searchStore.addRecentSearch(query)

  return {
    products: matchedProducts,
    categories: matchedCategories,
    recentSearches: searchStore.recentSearches,
  }
}

// Get search suggestions based on partial query
export function getSearchSuggestions(
  partialQuery: string,
  products: Product[],
  categories: Category[],
  limit = 5,
): string[] {
  if (!partialQuery.trim()) return []

  const lowercaseQuery = partialQuery.toLowerCase()
  const suggestions = new Set<string>()

  // Add product name suggestions
  products.forEach((product) => {
    if (product.name.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(product.name)
    }
  })

  // Add category name suggestions
  categories.forEach((category) => {
    if (category.name.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(category.name)
    }
  })

  // Add product category suggestions
  products.forEach((product) => {
    product.categories.forEach((category) => {
      if (category.toLowerCase().includes(lowercaseQuery)) {
        suggestions.add(category)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}

"use server"

import { revalidatePath } from "next/cache"
import type { Product } from "@/data/products"
import type { Brand } from "@/data/brands"
import type { Collection } from "@/data/collections"
import type { Seller } from "@/data/sellers"

// Product actions
export async function addProduct(product: Product) {
  try {
    // In a file-based approach, we're just revalidating paths
    // The actual data manipulation happens client-side with Zustand

    // Revalidate paths
    revalidatePath("/products")
    revalidatePath("/admin")

    return { success: true, id: product.id }
  } catch (error) {
    console.error("Error adding product:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateProduct(product: Product) {
  try {
    // Revalidate paths
    revalidatePath("/products")
    revalidatePath(`/products/${product.id}`)
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteProduct(id: number) {
  try {
    // Revalidate paths
    revalidatePath("/products")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Brand actions
export async function addBrand(brand: Brand) {
  try {
    // Revalidate paths
    revalidatePath("/admin")

    return { success: true, id: brand.id }
  } catch (error) {
    console.error("Error adding brand:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateBrand(brand: Brand) {
  try {
    // Revalidate paths
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error updating brand:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteBrand(id: number) {
  try {
    // Revalidate paths
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error deleting brand:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Collection actions
export async function addCollection(collection: Collection) {
  try {
    // Revalidate paths
    revalidatePath("/admin")

    return { success: true, id: collection.id }
  } catch (error) {
    console.error("Error adding collection:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateCollection(collection: Collection) {
  try {
    // Revalidate paths
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error updating collection:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteCollection(id: number) {
  try {
    // Revalidate paths
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error deleting collection:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Seller actions
export async function addSeller(seller: Seller) {
  try {
    // Revalidate paths
    revalidatePath("/sellers")
    revalidatePath("/admin")

    return { success: true, id: seller.id }
  } catch (error) {
    console.error("Error adding seller:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateSeller(seller: Seller) {
  try {
    // Revalidate paths
    revalidatePath("/sellers")
    revalidatePath(`/sellers/${seller.id}`)
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error updating seller:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteSeller(id: string) {
  try {
    // Revalidate paths
    revalidatePath("/sellers")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error deleting seller:", error)
    return { success: false, error: (error as Error).message }
  }
}

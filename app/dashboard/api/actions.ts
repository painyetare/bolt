"use server"

import { revalidatePath } from "next/cache"
import { useProductStore, type Product } from "@/data/products"

// Get seller products
export async function getSellerProducts(sellerId: string) {
  try {
    const products = useProductStore.getState().products.filter((product) => product.userCode === sellerId)

    return { success: true, products }
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return { success: false, error: (error as Error).message, products: [] }
  }
}

// Add seller product
export async function addSellerProduct(sellerId: string, product: Partial<Product>) {
  try {
    const productStore = useProductStore.getState()

    const newProductId = productStore.addProduct({
      name: product.name || "",
      price: product.price || "0",
      image: product.image || "",
      description: product.description || "",
      categories: product.categories || [],
      productId: product.productId || "",
      source: product.source || "",
      userCode: sellerId,
      quality: product.quality,
      inStock: product.inStock,
      discount: product.discount,
      rating: product.rating,
      reviewCount: product.reviewCount,
      colors: product.colors,
      sizes: product.sizes,
      featured: product.featured,
      dateAdded: new Date().toISOString().slice(0, 10),
      brandId: product.brandId,
      qcPictureUrl: product.qcPictureUrl,
      productLink: product.productLink,
    })

    // Revalidate paths
    revalidatePath("/products")
    revalidatePath("/dashboard/seller-products")
    revalidatePath(`/sellers/${sellerId}`)

    return { success: true, id: newProductId }
  } catch (error) {
    console.error("Error adding seller product:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Update seller product
export async function updateSellerProduct(sellerId: string, productId: number, product: Partial<Product>) {
  try {
    const productStore = useProductStore.getState()

    // Verify the product belongs to the seller
    const existingProduct = productStore.products.find((p) => p.id === productId)

    if (!existingProduct || existingProduct.userCode !== sellerId) {
      return { success: false, error: "Unauthorized: This product doesn't belong to the seller" }
    }

    productStore.updateProduct(productId, product)

    // Revalidate paths
    revalidatePath("/products")
    revalidatePath(`/products/${productId}`)
    revalidatePath("/dashboard/seller-products")
    revalidatePath(`/sellers/${sellerId}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating seller product:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Delete seller product
export async function deleteSellerProduct(sellerId: string, productId: number) {
  try {
    const productStore = useProductStore.getState()

    // Verify the product belongs to the seller
    const existingProduct = productStore.products.find((p) => p.id === productId)

    if (!existingProduct || existingProduct.userCode !== sellerId) {
      return { success: false, error: "Unauthorized: This product doesn't belong to the seller" }
    }

    productStore.deleteProduct(productId)

    // Revalidate paths
    revalidatePath("/products")
    revalidatePath("/dashboard/seller-products")
    revalidatePath(`/sellers/${sellerId}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting seller product:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Update seller profile
export async function updateSellerProfile(sellerId: string, sellerData: any) {
  try {
    // In a real application, you would update the seller data in your database
    // For now, we'll just revalidate the paths

    // Revalidate paths
    revalidatePath(`/sellers/${sellerId}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating seller profile:", error)
    return { success: false, error: (error as Error).message }
  }
}

import { NextResponse } from "next/server"
import { productAPI } from "@/data/products"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    // Fetch products based on parameters
    let products = []

    if (featured === "true") {
      products = await productAPI.getFeaturedProducts()
    } else if (category) {
      products = await productAPI.getProductsByCategory(category)
    } else if (brand) {
      const brandId = Number.parseInt(brand)
      products = await productAPI.getProductsByBrand(brandId)
    } else {
      products = await productAPI.getAllProducts()
    }

    // Apply limit if specified
    if (limit) {
      products = products.slice(0, limit)
    }

    // Sort by date added (newest first)
    products.sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
      return dateB - dateA
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { brandAPI } from "@/data/brands"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const featured = searchParams.get("featured")

    let brands

    if (query) {
      brands = await brandAPI.searchBrands(query)
    } else if (featured === "true") {
      brands = await brandAPI.getFeaturedBrands()
    } else {
      brands = await brandAPI.getAllBrands()
    }

    return NextResponse.json({ brands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newBrand = await brandAPI.createBrand(body)

    return NextResponse.json({ brand: newBrand }, { status: 201 })
  } catch (error) {
    console.error("Error creating brand:", error)
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 })
  }
}

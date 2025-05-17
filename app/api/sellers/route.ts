import { NextResponse } from "next/server"
import { sellers } from "@/data/sellers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const verified = searchParams.get("verified")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    let filteredSellers = [...sellers]

    if (verified === "true") {
      filteredSellers = filteredSellers.filter((seller) => seller.verified)
    }

    if (limit) {
      filteredSellers = filteredSellers.slice(0, limit)
    }

    // Sort by followers (most popular first)
    filteredSellers.sort((a, b) => (b.followers || 0) - (a.followers || 0))

    return NextResponse.json(filteredSellers)
  } catch (error) {
    console.error("Error fetching sellers:", error)
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 })
  }
}

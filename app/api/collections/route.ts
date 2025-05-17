import { NextResponse } from "next/server"
import { initialCollectionsData } from "@/data/collections"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    let filteredCollections = [...initialCollectionsData]

    if (featured === "true") {
      filteredCollections = filteredCollections.filter((collection) => collection.featured)
    }

    if (limit) {
      filteredCollections = filteredCollections.slice(0, limit)
    }

    // Sort by name
    filteredCollections.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(filteredCollections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}

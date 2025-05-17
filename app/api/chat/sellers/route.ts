import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSellers } from "@/lib/chat-service"

export async function GET(request: NextRequest) {
  // Get the user ID from the cookie
  const userId = cookies().get("discord_user_id")?.value

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all sellers
    const sellers = await getSellers()

    return NextResponse.json({ sellers })
  } catch (error) {
    console.error("Error fetching sellers:", error)
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 })
  }
}

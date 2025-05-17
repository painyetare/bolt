import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getOrCreateConversation } from "@/lib/chat-service"

export async function POST(request: NextRequest) {
  // Get the user ID from the cookie
  const userId = cookies().get("discord_user_id")?.value

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the seller ID from the request body
    const { sellerId } = await request.json()

    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID is required" }, { status: 400 })
    }

    // Create or get the conversation
    const conversation = await getOrCreateConversation(userId, sellerId)

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}

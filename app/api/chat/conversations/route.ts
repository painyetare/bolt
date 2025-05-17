import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserConversations } from "@/lib/chat-service"

export async function GET(request: NextRequest) {
  // Get the user ID from the cookie
  const userId = cookies().get("discord_user_id")?.value

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the user's conversations
    const conversations = await getUserConversations(userId)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

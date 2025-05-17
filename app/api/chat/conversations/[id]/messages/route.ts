import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getMessagesForConversation, markMessagesAsRead } from "@/lib/chat-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Get the user ID from the cookie
  const userId = cookies().get("discord_user_id")?.value

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversationId = params.id

  try {
    // Get messages for the conversation
    const messages = await getMessagesForConversation(conversationId)

    // Mark messages as read
    await markMessagesAsRead(conversationId, userId)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Get the user ID from the cookie
  const userId = cookies().get("discord_user_id")?.value

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversationId = params.id

  try {
    // Get the message content from the request body
    const { content } = await request.json()

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Save the message
    const message = await saveChatMessage(conversationId, userId, content.trim())

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// Import this at the top of the file
import { saveChatMessage } from "@/lib/chat-service"
